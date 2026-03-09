import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { OverviewPanelComponent } from '../panels/overview-panel/overview-panel';
import { PopulationPanelComponent } from '../panels/population-panel/population-panel';
import { EconomyPanelComponent } from '../panels/economy-panel/economy-panel';
import { GeopoliticsPanelComponent } from '../panels/geopolitics-panel/geopolitics-panel';
import { PoliciesPanelComponent } from '../panels/policies-panel/policies-panel';
import { IGX_TABS_DIRECTIVES } from 'igniteui-angular';
import { IgxButtonDirective, IgxRippleDirective } from 'igniteui-angular';

type Tab = 'overview' | 'population' | 'economy' | 'geopolitics' | 'policies';

interface TabDef {
  id: Tab;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OverviewPanelComponent,
    PopulationPanelComponent,
    EconomyPanelComponent,
    GeopoliticsPanelComponent,
    PoliciesPanelComponent,
    IGX_TABS_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  readonly game = inject(GameService);
  readonly router = inject(Router);

  readonly player = computed(() => this.game.playerCountry());
  readonly rank = computed(() => this.game.playerRank());
  readonly totalCountries = computed(() => this.game.allCountries().length);
  readonly turn = computed(() => this.game.turn());
  readonly year = computed(() => this.game.year());
  readonly quarter = computed(() => this.game.quarter());
  readonly day = computed(() => this.game.day());
  readonly isPaused = computed(() => this.game.isPaused());
  readonly recentEvents = computed(() => this.game.recentEvents());

  readonly activeTabIndex = signal<number>(0);
  readonly activeTab = computed<Tab>(() => this.tabs[this.activeTabIndex()].id);

  readonly tabs: TabDef[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'population', label: 'Population', icon: '👥' },
    { id: 'economy', label: 'Economy', icon: '💹' },
    { id: 'geopolitics', label: 'Geopolitics', icon: '🌍' },
    { id: 'policies', label: 'Policies', icon: '📋' },
  ];

  setTab(tab: Tab): void {
    const index = this.tabs.findIndex(t => t.id === tab);
    if (index >= 0) this.activeTabIndex.set(index);
  }

  togglePause(): void {
    if (this.isPaused()) {
      this.game.resume();
    } else {
      this.game.pause();
    }
  }

  formatGdp(v: number): string {
    return this.game.formatGdp(v);
  }

  growthColor(rate: number): string {
    if (rate >= 3) return 'var(--success)';
    if (rate >= 0) return 'var(--warning)';
    return 'var(--danger)';
  }
}
