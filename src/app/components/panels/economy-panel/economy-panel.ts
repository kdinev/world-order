import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-economy-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe],
  templateUrl: './economy-panel.html',
  styleUrl: './economy-panel.scss',
})
export class EconomyPanelComponent {
  readonly game = inject(GameService);
  readonly player = computed(() => this.game.playerCountry());

  readonly sectorBars = computed(() => {
    const p = this.player();
    if (!p) return [];
    const entries = [
      { label: 'Agriculture', value: p.sectors.agriculture, color: '#8BC34A', icon: '🌾' },
      { label: 'Industry', value: p.sectors.industry, color: '#795548', icon: '🏭' },
      { label: 'Services', value: p.sectors.services, color: '#2196F3', icon: '🏢' },
      { label: 'Technology', value: p.sectors.technology, color: '#00BCD4', icon: '💻' },
      { label: 'Energy', value: p.sectors.energy, color: '#FF9800', icon: '⚡' },
      { label: 'Tourism', value: p.sectors.tourism, color: '#E91E63', icon: '✈️' },
    ];
    const max = Math.max(...entries.map(e => e.value), 1);
    return entries.map(e => ({ ...e, barWidth: (e.value / max) * 100 }));
  });

  readonly tradeBalance = computed(() => {
    const p = this.player();
    if (!p) return 0;
    return Math.round((p.exports - p.imports) * 10) / 10;
  });

  readonly govRevenue = computed(() => {
    const p = this.player();
    if (!p) return 0;
    return Math.round(p.gdp * p.policies.taxRate / 100 * 10) / 10;
  });

  readonly govSpending = computed(() => {
    const p = this.player();
    if (!p) return 0;
    const budgetSum = Object.values(p.budgets).reduce((s, v) => s + v, 0);
    return Math.round(this.govRevenue() * budgetSum / 100 * 10) / 10;
  });

  readonly fiscalBalance = computed(() => {
    return Math.round((this.govRevenue() - this.govSpending()) * 10) / 10;
  });

  readonly budgetBreakdown = computed(() => {
    const p = this.player();
    if (!p) return [];
    const rev = this.govRevenue();
    return [
      { label: 'Healthcare', pct: p.budgets.healthcare, amount: rev * p.budgets.healthcare / 100, color: '#E91E63' },
      { label: 'Education', pct: p.budgets.education, amount: rev * p.budgets.education / 100, color: '#2196F3' },
      { label: 'Military', pct: p.budgets.military, amount: rev * p.budgets.military / 100, color: '#F44336' },
      { label: 'Infrastructure', pct: p.budgets.infrastructure, amount: rev * p.budgets.infrastructure / 100, color: '#FF9800' },
      { label: 'Social Programs', pct: p.budgets.socialPrograms, amount: rev * p.budgets.socialPrograms / 100, color: '#4CAF50' },
      { label: 'Research', pct: p.budgets.research, amount: rev * p.budgets.research / 100, color: '#9C27B0' },
    ];
  });

  formatGdp(v: number): string {
    return this.game.formatGdp(v);
  }

  scoreColor(value: number): string {
    if (value >= 70) return 'var(--success)';
    if (value >= 40) return 'var(--warning)';
    return 'var(--danger)';
  }

  balanceColor(v: number): string {
    return v >= 0 ? 'var(--success)' : 'var(--danger)';
  }

  absValue(v: number): number {
    return Math.abs(v);
  }
}
