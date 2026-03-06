import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-population-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './population-panel.html',
  styleUrl: './population-panel.scss',
})
export class PopulationPanelComponent {
  readonly game = inject(GameService);
  readonly player = computed(() => this.game.playerCountry());

  readonly demographicSegments = computed(() => {
    const p = this.player();
    if (!p) return [];
    return [
      { label: 'Youth (0–14)', pct: p.youthPercent, color: '#00d4ff' },
      { label: 'Working Age (15–64)', pct: p.workingPercent, color: '#00e676' },
      { label: 'Elderly (65+)', pct: p.elderlyPercent, color: '#ffab00' },
    ];
  });

  readonly demographicConicGradient = computed(() => {
    const segs = this.demographicSegments();
    if (!segs.length) return '';
    let cumulative = 0;
    const parts: string[] = [];
    for (const seg of segs) {
      const start = cumulative;
      const end = cumulative + seg.pct;
      parts.push(`${seg.color} ${start}% ${end}%`);
      cumulative = end;
    }
    return `conic-gradient(${parts.join(', ')})`;
  });

  readonly activeWorkforce = computed(() => {
    const p = this.player();
    if (!p) return 0;
    const workingPop = (p.population * p.workingPercent) / 100;
    const employed = workingPop * (1 - p.unemploymentRate / 100);
    return Math.round(employed * 10) / 10;
  });

  formatPop(v: number): string {
    return this.game.formatPopulation(v);
  }

  scoreColor(value: number, invert = false): string {
    const v = invert ? 100 - value : value;
    if (v >= 70) return 'var(--success)';
    if (v >= 40) return 'var(--warning)';
    return 'var(--danger)';
  }
}
