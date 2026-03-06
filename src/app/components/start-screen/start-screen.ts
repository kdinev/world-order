import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { PRESET_INFO } from '../../data/player-presets.data';
import type { CountryPreset } from '../../models/game.model';

const COUNTRY_COLORS = [
  '#E91E63', '#9C27B0', '#3F51B5', '#2196F3', '#00BCD4',
  '#009688', '#4CAF50', '#FF9800', '#FF5722', '#795548',
];

@Component({
  selector: 'app-start-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './start-screen.html',
  styleUrl: './start-screen.scss',
})
export class StartScreenComponent {
  private readonly router = inject(Router);
  private readonly game = inject(GameService);

  readonly presets: { id: CountryPreset; label: string; icon: string; tagline: string; description: string }[] = (
    Object.entries(PRESET_INFO) as [CountryPreset, (typeof PRESET_INFO)[CountryPreset]][]
  ).map(([id, info]) => ({ id, ...info }));

  readonly selectedPreset = signal<CountryPreset | null>(null);
  readonly selectedColor = signal(COUNTRY_COLORS[0]);
  readonly colors = COUNTRY_COLORS;

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
    if (this.form.invalid || !this.selectedPreset()) return;
    const { countryName, countryCode } = this.form.getRawValue();
    this.game.startGame(countryName, countryCode, this.selectedColor(), this.selectedPreset()!);
    this.router.navigate(['/game']);
  }
}
