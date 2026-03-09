import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { PRESET_INFO, buildCustomPreset, CUSTOM_BUDGET, type PresetInfoEntry } from '../../data/player-presets.data';
import type { CountryPreset } from '../../models/game.model';
import { IGX_INPUT_GROUP_DIRECTIVES } from 'igniteui-angular';
import { IgxButtonDirective, IgxRippleDirective } from 'igniteui-angular';

const COUNTRY_COLORS = [
  '#E91E63', '#9C27B0', '#3F51B5', '#2196F3', '#00BCD4',
  '#009688', '#4CAF50', '#FF9800', '#FF5722', '#795548',
];

type CustomDimKey = 'economy' | 'military' | 'social' | 'technology' | 'stability' | 'resources';

interface CustomDimConfig {
  key: CustomDimKey;
  icon: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-start-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective,
  ],
  templateUrl: './start-screen.html',
  styleUrl: './start-screen.scss',
})
export class StartScreenComponent {
  private readonly router = inject(Router);
  private readonly game = inject(GameService);

  readonly presets: ({ id: CountryPreset } & PresetInfoEntry)[] = (
    Object.entries(PRESET_INFO) as [CountryPreset, PresetInfoEntry][]
  ).map(([id, info]) => ({ id, ...info }));

  readonly selectedPreset = signal<CountryPreset | null>(null);
  readonly selectedColor = signal(COUNTRY_COLORS[0]);
  readonly colors = COUNTRY_COLORS;

  // ─── Custom allocation ───────────────────────────────────────────────────

  readonly CUSTOM_BUDGET = CUSTOM_BUDGET;

  readonly CUSTOM_DIMS: CustomDimConfig[] = [
    { key: 'economy',    icon: '💰', label: 'Economy',    description: 'GDP, growth rate, business climate & trade' },
    { key: 'military',   icon: '⚔️',  label: 'Military',   description: 'Armed forces strength & defence spending' },
    { key: 'social',     icon: '🏥', label: 'Social',     description: 'Healthcare, education & social support' },
    { key: 'technology', icon: '💻', label: 'Technology', description: 'Digital access, workforce skills & research' },
    { key: 'stability',  icon: '⚖️',  label: 'Stability',  description: 'Political stability & press freedoms' },
    { key: 'resources',  icon: '🏗️', label: 'Resources',  description: 'Energy, infrastructure & environment' },
  ];

  readonly customAlloc = signal<Record<CustomDimKey, number>>({
    economy: 56, military: 56, social: 56, technology: 56, stability: 56, resources: 56,
  });

  readonly customTotal = computed(() =>
    Object.values(this.customAlloc()).reduce((sum, v) => sum + v, 0),
  );

  readonly remainingBudget = computed(() => this.CUSTOM_BUDGET - this.customTotal());

  readonly budgetPercent = computed(() =>
    Math.min(100, Math.round((this.customTotal() / this.CUSTOM_BUDGET) * 100)),
  );

  setAlloc(key: CustomDimKey, value: number): void {
    this.customAlloc.update(a => ({ ...a, [key]: Math.min(80, Math.max(0, value)) }));
  }

  // ─── Form ────────────────────────────────────────────────────────────────

  readonly form = new FormGroup({
    countryName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(24)],
    }),
    countryCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern(/^[A-Za-z]+$/)],
    }),
  });

  private readonly formStatus = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  readonly canEstablish = computed(() => {
    if (this.formStatus() !== 'VALID') return false;
    if (this.selectedPreset() === 'custom' && this.customTotal() > this.CUSTOM_BUDGET) return false;
    return true;
  });

  readonly codePreview = computed(() => {
    const raw = this.form.controls.countryCode.value ?? '';
    return raw.toUpperCase().slice(0, 2);
  });

  selectPreset(preset: CountryPreset): void {
    this.selectedPreset.set(preset);
  }

  backToPresets(): void {
    this.selectedPreset.set(null);
  }

  startGame(): void {
    if (!this.canEstablish() || !this.selectedPreset()) return;
    const { countryName, countryCode } = this.form.getRawValue();
    const preset = this.selectedPreset()!;
    if (preset === 'custom') {
      this.game.startGame(countryName, countryCode, this.selectedColor(), 'custom', buildCustomPreset(this.customAlloc()));
    } else {
      this.game.startGame(countryName, countryCode, this.selectedColor(), preset);
    }
    this.router.navigate(['/game']);
  }
}
