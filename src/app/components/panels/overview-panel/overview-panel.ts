import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-overview-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './overview-panel.html',
  styleUrl: './overview-panel.scss',
})
export class OverviewPanelComponent {
  readonly game = inject(GameService);
  readonly player = computed(() => this.game.playerCountry());
  readonly rank = computed(() => this.game.playerRank());
  readonly totalCountries = computed(() => this.game.allCountries().length);
  readonly ranked = computed(() => this.game.rankedCountries().slice(0, 5));
  readonly events = computed(() => this.game.recentEvents());

  readonly gdpHistoryBars = computed(() => {
    const p = this.player();
    if (!p || !p.gdpHistory.length) return [];
    const max = Math.max(...p.gdpHistory, 1);
    return p.gdpHistory.map((v, i) => ({
      height: Math.round((v / max) * 100),
      value: v,
      label: `Q${((i) % 4) + 1}`,
    }));
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

  readonly budgetTotal = computed(() => {
    const p = this.player();
    if (!p) return 0;
    return Object.values(p.budgets).reduce((s, v) => s + v, 0);
  });

  scoreColor(value: number, invert = false): string {
    const v = invert ? 100 - value : value;
    if (v >= 70) return 'var(--success)';
    if (v >= 40) return 'var(--warning)';
    return 'var(--danger)';
  }

  formatGdp(v: number): string {
    return this.game.formatGdp(v);
  }

  formatPop(v: number): string {
    return this.game.formatPopulation(v);
  }

  growthColor(rate: number): string {
    if (rate >= 3) return 'var(--success)';
    if (rate >= 0) return 'var(--warning)';
    return 'var(--danger)';
  }

  absValue(v: number): number {
    return Math.abs(v);
  }
}
