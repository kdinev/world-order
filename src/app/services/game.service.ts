import { Injectable, signal, computed, inject } from '@angular/core';
import type { Country, CountryPreset, GameState, Budgets, Policies, Relation, GameEvent } from '../models/game.model';
import { WORLD_COUNTRIES } from '../data/world-countries.data';
import { PLAYER_PRESETS } from '../data/player-presets.data';
import { EVENT_TEMPLATES } from '../data/events.data';
import { TurnEngineService } from './turn-engine.service';

function buildRelations(countries: Country[], forCountryId: string): Relation[] {
  return countries
    .filter(c => c.id !== forCountryId)
    .map(c => ({
      countryId: c.id,
      countryName: c.name,
      code: c.code,
      color: c.color,
      stance: 'neutral' as const,
      tradeAgreement: false,
      defenseAlliance: false,
      sanctionsActive: false,
      score: 0,
    }));
}

const START_YEAR = 2026;

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly engine = inject(TurnEngineService);

  private readonly _state = signal<GameState>({
    started: false,
    turn: 0,
    year: START_YEAR,
    quarter: 1,
    playerCountryId: '',
    countries: [],
    recentEvents: [],
    allEvents: [],
  });

  readonly state = this._state.asReadonly();
  readonly isStarted = computed(() => this._state().started);
  readonly turn = computed(() => this._state().turn);
  readonly year = computed(() => this._state().year);
  readonly quarter = computed(() => this._state().quarter);
  readonly recentEvents = computed(() => this._state().recentEvents);

  readonly playerCountry = computed(() => {
    const s = this._state();
    return s.countries.find(c => c.id === s.playerCountryId) ?? null;
  });

  readonly allCountries = computed(() => this._state().countries);

  readonly rankedCountries = computed(() =>
    [...this._state().countries].sort((a, b) => b.gdp - a.gdp),
  );

  readonly playerRank = computed(() => {
    const ranked = this.rankedCountries();
    const id = this._state().playerCountryId;
    const idx = ranked.findIndex(c => c.id === id);
    return idx === -1 ? 0 : idx + 1;
  });

  // ─── Game Lifecycle ────────────────────────────────────────────────────────

  startGame(playerName: string, code: string, color: string, preset: CountryPreset): void {
    const presetData = PLAYER_PRESETS[preset];
    const playerId = 'player';

    // Build full country list (AI + player) without relations first
    const aiCountries: Country[] = WORLD_COUNTRIES.map(c => ({
      ...c,
      relations: [],
    }));

    const playerCountry: Country = {
      ...presetData,
      id: playerId,
      name: playerName,
      code: code.toUpperCase().slice(0, 2),
      color,
      isPlayer: true,
      relations: [],
      gdpHistory: Array.from({ length: 8 }, (_, i) => {
        const gdp = presetData.gdp;
        const growthPerQ = (presetData.gdpGrowthRate / 4 / 100);
        return Math.round(gdp * Math.pow(1 / (1 + growthPerQ), 7 - i) * 10) / 10;
      }),
    };

    const allCountries = [...aiCountries, playerCountry];

    // Now populate relations for all countries
    const withRelations: Country[] = allCountries.map(c => ({
      ...c,
      relations: buildRelations(allCountries, c.id),
    }));

    this._state.set({
      started: true,
      turn: 0,
      year: START_YEAR,
      quarter: 1,
      playerCountryId: playerId,
      countries: withRelations,
      recentEvents: [],
      allEvents: [],
    });
  }

  // ─── Turn Processing ───────────────────────────────────────────────────────

  advanceTurn(): void {
    this._state.update(s => {
      const newTurn = s.turn + 1;
      const newQuarter = ((s.quarter) % 4) + 1;
      const newYear = newQuarter === 1 ? s.year + 1 : s.year;

      // Process each country through the turn engine
      const newEvents: GameEvent[] = [];
      const updatedCountries = s.countries.map(c => {
        // Pick random events for this country
        const events = this.engine.pickEvents(c, EVENT_TEMPLATES, newTurn);
        newEvents.push(...events);

        // Apply event effects, then run the regular turn simulation
        const afterEvents = this.engine.applyEventEffects(c, events, EVENT_TEMPLATES);
        return this.engine.processCountry(afterEvents, newTurn);
      });

      // Relations: drift toward neutral very slowly if no player interaction
      const playerRelDrift = updatedCountries.map(c => {
        if (!c.isPlayer) return c;
        const driftedRelations = c.relations.map(r => ({
          ...r,
          score: r.score * 0.98, // very slow drift to 0
        }));
        return { ...c, relations: driftedRelations };
      });

      const playerEvents = newEvents.filter(e => e.countryId === s.playerCountryId);

      return {
        ...s,
        turn: newTurn,
        quarter: newQuarter,
        year: newYear,
        countries: playerRelDrift,
        recentEvents: playerEvents,
        allEvents: [...s.allEvents, ...playerEvents],
      };
    });
  }

  // ─── Player Budget & Policy Actions ───────────────────────────────────────

  updateBudgets(budgets: Budgets): void {
    this.updatePlayer(c => ({ ...c, budgets }));
  }

  updatePolicies(policies: Policies): void {
    this.updatePlayer(c => ({ ...c, policies }));
  }

  // ─── Diplomacy Actions ─────────────────────────────────────────────────────

  sendAid(targetId: string, amount: number): void {
    this.updatePlayer(c => {
      const relations = c.relations.map(r =>
        r.countryId === targetId
          ? { ...r, score: Math.min(100, r.score + amount * 2), stance: this.scoreToStance(r.score + amount * 2) }
          : r,
      );
      const newGdp = Math.max(0, c.gdp - amount);
      return { ...c, relations, gdp: Math.round(newGdp * 10) / 10 };
    });
    // Target country also warms up
    this.updateCountry(targetId, c => {
      const relations = c.relations.map(r =>
        r.countryId === 'player'
          ? { ...r, score: Math.min(100, r.score + amount * 1.5), stance: this.scoreToStance(r.score + amount * 1.5) }
          : r,
      );
      return { ...c, relations };
    });
  }

  imposeSanctions(targetId: string): void {
    this.updatePlayer(c => {
      const relations = c.relations.map(r =>
        r.countryId === targetId
          ? { ...r, score: Math.max(-100, r.score - 20), stance: this.scoreToStance(r.score - 20), sanctionsActive: true, tradeAgreement: false, defenseAlliance: false }
          : r,
      );
      return { ...c, relations };
    });
    this.updateCountry(targetId, c => {
      const relations = c.relations.map(r =>
        r.countryId === 'player'
          ? { ...r, score: Math.max(-100, r.score - 25), sanctionsActive: true }
          : r,
      );
      return { ...c, businessClimate: Math.max(0, c.businessClimate - 5), gdpGrowthRate: c.gdpGrowthRate - 0.3 };
    });
  }

  liftSanctions(targetId: string): void {
    this.updatePlayer(c => {
      const relations = c.relations.map(r =>
        r.countryId === targetId ? { ...r, sanctionsActive: false, score: Math.min(100, r.score + 5) } : r,
      );
      return { ...c, relations };
    });
  }

  signTradeAgreement(targetId: string): void {
    const rel = this.playerCountry()?.relations.find(r => r.countryId === targetId);
    if (!rel || rel.score < 20) return; // require friendly relations
    this.updatePlayer(c => {
      const relations = c.relations.map(r =>
        r.countryId === targetId ? { ...r, tradeAgreement: true } : r,
      );
      const newExports = c.exports * 1.05;
      const newFdi = c.fdi + 3;
      return { ...c, relations, exports: Math.round(newExports * 10) / 10, fdi: Math.round(newFdi * 10) / 10 };
    });
  }

  terminateTradeAgreement(targetId: string): void {
    this.updatePlayer(c => {
      const relations = c.relations.map(r =>
        r.countryId === targetId ? { ...r, tradeAgreement: false, score: r.score - 10 } : r,
      );
      return { ...c, relations };
    });
  }

  signDefenseAlliance(targetId: string): void {
    const rel = this.playerCountry()?.relations.find(r => r.countryId === targetId);
    if (!rel || rel.score < 50) return; // require allied relations
    this.updatePlayer(c => {
      const relations = c.relations.map(r =>
        r.countryId === targetId ? { ...r, defenseAlliance: true } : r,
      );
      return { ...c, relations };
    });
  }

  improveRelations(targetId: string): void {
    this.updatePlayer(c => {
      const relations = c.relations.map(r =>
        r.countryId === targetId
          ? { ...r, score: Math.min(100, r.score + 10), stance: this.scoreToStance(r.score + 10) }
          : r,
      );
      return { ...c, relations };
    });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  formatGdp(billions: number): string {
    if (billions >= 1000) return `$${(billions / 1000).toFixed(2)}T`;
    return `$${billions.toFixed(1)}B`;
  }

  formatPopulation(millions: number): string {
    if (millions >= 1000) return `${(millions / 1000).toFixed(2)}B`;
    return `${millions.toFixed(1)}M`;
  }

  private scoreToStance(score: number): Relation['stance'] {
    if (score >= 70) return 'allied';
    if (score >= 30) return 'friendly';
    if (score >= -20) return 'neutral';
    if (score >= -50) return 'tense';
    return 'hostile';
  }

  private updatePlayer(fn: (c: Country) => Country): void {
    this._state.update(s => ({
      ...s,
      countries: s.countries.map(c => (c.id === s.playerCountryId ? fn(c) : c)),
    }));
  }

  private updateCountry(id: string, fn: (c: Country) => Country): void {
    this._state.update(s => ({
      ...s,
      countries: s.countries.map(c => (c.id === id ? fn(c) : c)),
    }));
  }
}
