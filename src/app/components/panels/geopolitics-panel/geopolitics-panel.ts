import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { GameService } from '../../../services/game.service';
import type { Relation } from '../../../models/game.model';

@Component({
  selector: 'app-geopolitics-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe],
  templateUrl: './geopolitics-panel.html',
  styleUrl: './geopolitics-panel.scss',
})
export class GeopoliticsPanelComponent {
  readonly game = inject(GameService);
  readonly player = computed(() => this.game.playerCountry());
  readonly ranked = computed(() => this.game.rankedCountries());
  readonly playerRank = computed(() => this.game.playerRank());

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
