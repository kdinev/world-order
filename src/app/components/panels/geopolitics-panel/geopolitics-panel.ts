import { Component, ChangeDetectionStrategy, inject, computed, signal, viewChild } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { GameService } from '../../../services/game.service';
import type { Relation, Country } from '../../../models/game.model';
import { IgxButtonDirective, IgxRippleDirective, IgxTooltipDirective, IgxTooltipTargetDirective } from 'igniteui-angular';
import { IgxChipComponent } from 'igniteui-angular';
import { IGX_GRID_DIRECTIVES, IgxGridComponent } from 'igniteui-angular/grids/grid';

@Component({
  selector: 'app-geopolitics-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TitleCasePipe,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxTooltipDirective,
    IgxTooltipTargetDirective,
    IgxChipComponent,
    IGX_GRID_DIRECTIVES,
  ],
  templateUrl: './geopolitics-panel.html',
  styleUrl: './geopolitics-panel.scss',
})
export class GeopoliticsPanelComponent {
  readonly game = inject(GameService);
  readonly player = computed(() => this.game.playerCountry());
  readonly ranked = computed(() => this.game.rankedCountries());
  readonly playerRank = computed(() => this.game.playerRank());

  readonly gridRef = viewChild<IgxGridComponent>('rankingsGrid');

  readonly rankingRows = computed(() => {
    const p = this.player();
    return this.ranked().map((country, i) => {
      const rel = p?.relations.find(r => r.countryId === country.id);
      return {
        id: country.id,
        rankIndex: i,
        name: country.name,
        code: country.code,
        color: country.color,
        gdp: country.gdp,
        gdpFormatted: this.formatGdp(country.gdp),
        gdpPerCapita: country.gdpPerCapita,
        population: country.population,
        populationFormatted: this.formatPop(country.population),
        gdpGrowthRate: country.gdpGrowthRate,
        isPlayer: country.isPlayer,
        stance: rel?.stance ?? null,
        stanceColor: rel ? this.stanceColor(rel.stance) : '',
        stanceVariant: rel ? this.stanceVariant(rel.stance) : null,
        stanceIcon: rel ? this.stanceIcon(rel.stance) : '',
        tradeAgreement: rel?.tradeAgreement ?? false,
        defenseAlliance: rel?.defenseAlliance ?? false,
        sanctionsActive: rel?.sanctionsActive ?? false,
      };
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly rowClassesConfig = { 'row--player': (row: any) => row.data['isPlayer'] as boolean };

  readonly selectedCountryId = signal<string | null>(null);

  readonly selectedRelation = computed(() => {
    const id = this.selectedCountryId();
    if (!id) return null;
    return this.player()?.relations.find(r => r.countryId === id) ?? null;
  });

  readonly selectedCountry = computed(() => {
    const id = this.selectedCountryId();
    if (!id) return null;
    return this.game.allCountries().find(c => c.id === id) ?? null;
  });

  selectCountry(id: string): void {
    this.selectedCountryId.set(this.selectedCountryId() === id ? null : id);
  }

  onRowSelectionChange(event: { added: Country[]; removed: Country[]; cancel: boolean }): void {
    const addedId = event.added?.[0]?.id;
    console.log(addedId);
    if (addedId !== undefined) {
      const row = this.rankingRows().find(r => r.id === addedId);
      if (row?.isPlayer) {
        event.cancel = true;
        return;
      }
    }
    this.selectedCountryId.set(event.added?.length ? addedId : null);
  }

  deselectAll(): void {
    this.selectedCountryId.set(null);
    this.gridRef()?.deselectAllRows();
  }

  sendAid(): void {
    const id = this.selectedCountryId();
    if (!id) return;
    this.game.sendAid(id, 1); // send 1B in aid
  }

  imposeSanctions(): void {
    const id = this.selectedCountryId();
    if (!id) return;
    this.game.imposeSanctions(id);
  }

  liftSanctions(): void {
    const id = this.selectedCountryId();
    if (!id) return;
    this.game.liftSanctions(id);
  }

  signTrade(): void {
    const id = this.selectedCountryId();
    if (!id) return;
    this.game.signTradeAgreement(id);
  }

  terminateTrade(): void {
    const id = this.selectedCountryId();
    if (!id) return;
    this.game.terminateTradeAgreement(id);
  }

  signAlliance(): void {
    const id = this.selectedCountryId();
    if (!id) return;
    this.game.signDefenseAlliance(id);
  }

  improveRelations(): void {
    const id = this.selectedCountryId();
    if (!id) return;
    this.game.improveRelations(id);
  }

  stanceVariant(stance: Relation['stance']): string | null {
    const map: Record<Relation['stance'], string | null> = {
      allied: 'success',
      friendly: 'info',
      neutral: null,
      tense: 'warning',
      hostile: 'danger',
      war: 'danger',
    };
    return map[stance];
  }

  stanceColor(stance: Relation['stance']): string {
    const map: Record<Relation['stance'], string> = {
      allied: 'var(--success)',
      friendly: '#8BC34A',
      neutral: 'var(--text-secondary)',
      tense: 'var(--warning)',
      hostile: '#FF7043',
      war: 'var(--danger)',
    };
    return map[stance];
  }

  stanceIcon(stance: Relation['stance']): string {
    const map: Record<Relation['stance'], string> = {
      allied: '🤝',
      friendly: '😊',
      neutral: '😐',
      tense: '😤',
      hostile: '😠',
      war: '⚔️',
    };
    return map[stance];
  }

  formatGdp(v: number): string {
    return this.game.formatGdp(v);
  }

  formatPop(v: number): string {
    return this.game.formatPopulation(v);
  }

  scoreBar(score: number): number {
    return ((score + 100) / 200) * 100;
  }
}
