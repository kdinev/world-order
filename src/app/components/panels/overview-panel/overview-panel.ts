import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { IgxLinearProgressBarComponent } from 'igniteui-angular';
import { IgxBadgeComponent } from 'igniteui-angular';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexPlotOptions, ApexDataLabels, ApexFill, ApexGrid } from 'ng-apexcharts';

@Component({
  selector: 'app-overview-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IgxLinearProgressBarComponent,
    IgxBadgeComponent,
    NgApexchartsModule,
  ],
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

  readonly gdpChartOptions = computed(() => {
    const p = this.player();
    const currentYear = this.game.year();
    const currentQuarter = this.game.quarter();
    const rawHistory = p?.gdpHistory ?? [];

    // Fallback demo data so the chart is always visible for testing
    const history = rawHistory.length >= 2
      ? rawHistory
      : (p ? Array.from({ length: 8 }, (_, i) => Math.round(p.gdp * Math.pow(0.99, 7 - i) * 10) / 10) : []);

    // GDP stored in billions — display as-is
    const values = history.map(v => +v.toFixed(1));

    // Quarterly labels working backwards from current position (e.g. "Q3 '26")
    const labels = history.map((_, i) => {
      const offset = history.length - 1 - i;
      let q = currentQuarter - (offset % 4);
      let y = currentYear - Math.floor(offset / 4);
      if (q <= 0) { q += 4; y -= 1; }
      return `Q${q} '${String(y).slice(-2)}`;
    });

    const series: ApexAxisChartSeries = [{ name: 'GDP ($B)', data: values }];

    const chart: ApexChart = {
      type: 'bar',
      height: 200,
      toolbar: { show: false },
      background: 'transparent',
      animations: { enabled: false },
      sparkline: { enabled: false },
    };

    const xaxis: ApexXAxis = {
      categories: labels,
      labels: { style: { colors: '#5a7a8f', fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    };

    const yaxis: ApexYAxis = {
      labels: { style: { colors: '#5a7a8f', fontSize: '11px' } },
      min: 0,
    };

    const plotOptions: ApexPlotOptions = {
      bar: { borderRadius: 4, columnWidth: '60%' },
    };

    const dataLabels: ApexDataLabels = { enabled: false };

    const fill: ApexFill = {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        gradientToColors: ['rgba(0,212,255,0.3)'],
        stops: [0, 100],
      },
    };

    const grid: ApexGrid = {
      borderColor: 'rgba(255,255,255,0.06)',
      strokeDashArray: 3,
    };

    return { series, chart, xaxis, yaxis, plotOptions, dataLabels, fill, grid,
      colors: ['#00d4ff'],
      theme: { mode: 'dark' as const } };
  });

  progressType(value: number): 'success' | 'warning' | 'danger' | 'default' {
    if (value >= 66) return 'success';
    if (value >= 33) return 'warning';
    return 'danger';
  }

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
