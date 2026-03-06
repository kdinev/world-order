import { Component, ChangeDetectionStrategy, inject, computed, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { GameService } from '../../../services/game.service';
import type { Budgets, Policies, TradePolicy, ImmigrationPolicy, EnvPolicy } from '../../../models/game.model';

@Component({
  selector: 'app-policies-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TitleCasePipe],
  templateUrl: './policies-panel.html',
  styleUrl: './policies-panel.scss',
})
export class PoliciesPanelComponent implements OnInit {
  readonly game = inject(GameService);
  readonly player = computed(() => this.game.playerCountry());

  readonly tradePolicies: TradePolicy[] = ['open', 'moderate', 'protected'];
  readonly immigrationPolicies: ImmigrationPolicy[] = ['open', 'moderate', 'restricted'];
  readonly envPolicies: EnvPolicy[] = ['green', 'balanced', 'industrial'];

  readonly budgetKeys: (keyof Budgets)[] = [
    'healthcare', 'education', 'military', 'infrastructure', 'socialPrograms', 'research',
  ];

  readonly budgetIcons: Record<keyof Budgets, string> = {
    healthcare: '🏥',
    education: '📚',
    military: '⚔️',
    infrastructure: '🏗️',
    socialPrograms: '🤝',
    research: '🔬',
  };

  readonly budgetDescriptions: Record<keyof Budgets, string> = {
    healthcare: 'Improves healthcare index, life expectancy, and population growth',
    education: 'Boosts education index, workforce skill level, and literacy rate',
    military: 'Increases military strength and political stability',
    infrastructure: 'Raises infrastructure index and labor productivity',
    socialPrograms: 'Improves social support, reduces crime, and increases happiness',
    research: 'Drives tech sector growth and long-term GDP growth',
  };

  budgetForm!: FormGroup<{
    healthcare: FormControl<number>;
    education: FormControl<number>;
    military: FormControl<number>;
    infrastructure: FormControl<number>;
    socialPrograms: FormControl<number>;
    research: FormControl<number>;
  }>;

  policyForm!: FormGroup<{
    taxRate: FormControl<number>;
    tradePolicy: FormControl<TradePolicy>;
    immigrationPolicy: FormControl<ImmigrationPolicy>;
    envPolicy: FormControl<EnvPolicy>;
  }>;

  get budgetTotal(): number {
    const v = this.budgetForm.value;
    return (v.healthcare ?? 0) + (v.education ?? 0) + (v.military ?? 0) +
      (v.infrastructure ?? 0) + (v.socialPrograms ?? 0) + (v.research ?? 0);
  }

  get budgetValid(): boolean {
    return this.budgetTotal === 100;
  }

  get taxRate(): number {
    return this.policyForm.value.taxRate ?? 25;
  }

  get govRevenue(): number {
    const p = this.player();
    if (!p) return 0;
    return p.gdp * (this.taxRate / 100);
  }

  get budgetTotalColor(): string {
    const total = this.budgetTotal;
    if (total === 100) return 'var(--success)';
    if (total > 90 && total < 110) return 'var(--warning)';
    return 'var(--danger)';
  }

  ngOnInit(): void {
    const p = this.player();
    const b = p?.budgets ?? { healthcare: 20, education: 20, military: 15, infrastructure: 15, socialPrograms: 20, research: 10 };
    const pol = p?.policies ?? { taxRate: 25, tradePolicy: 'moderate', immigrationPolicy: 'moderate', envPolicy: 'balanced' };

    this.budgetForm = new FormGroup({
      healthcare: new FormControl<number>(b.healthcare, { nonNullable: true, validators: [Validators.min(0), Validators.max(100)] }),
      education: new FormControl<number>(b.education, { nonNullable: true, validators: [Validators.min(0), Validators.max(100)] }),
      military: new FormControl<number>(b.military, { nonNullable: true, validators: [Validators.min(0), Validators.max(100)] }),
      infrastructure: new FormControl<number>(b.infrastructure, { nonNullable: true, validators: [Validators.min(0), Validators.max(100)] }),
      socialPrograms: new FormControl<number>(b.socialPrograms, { nonNullable: true, validators: [Validators.min(0), Validators.max(100)] }),
      research: new FormControl<number>(b.research, { nonNullable: true, validators: [Validators.min(0), Validators.max(100)] }),
    });

    this.policyForm = new FormGroup({
      taxRate: new FormControl<number>(pol.taxRate, { nonNullable: true, validators: [Validators.min(10), Validators.max(50)] }),
      tradePolicy: new FormControl<TradePolicy>(pol.tradePolicy, { nonNullable: true }),
      immigrationPolicy: new FormControl<ImmigrationPolicy>(pol.immigrationPolicy, { nonNullable: true }),
      envPolicy: new FormControl<EnvPolicy>(pol.envPolicy, { nonNullable: true }),
    });
  }

  applyPolicies(): void {
    if (!this.budgetValid) return;

    const bv = this.budgetForm.value as Budgets;
    const pv = this.policyForm.value as Policies;

    this.game.updateBudgets(bv);
    this.game.updatePolicies(pv);
  }

  distribute(): void {
    // Evenly distribute 100% across 6 budget categories
    const each = Math.floor(100 / 6);
    const remainder = 100 - each * 6;
    this.budgetForm.setValue({
      healthcare: each,
      education: each,
      military: each,
      infrastructure: each,
      socialPrograms: each + remainder,
      research: each,
    });
  }

  policyDescription(key: keyof Policies, value: string): string {
    const descriptions: Record<string, Record<string, string>> = {
      tradePolicy: {
        open: 'More exports & FDI, but vulnerable to global shocks',
        moderate: 'Balanced trade with moderate tariff protection',
        protected: 'Higher tariffs boost domestic industry, reduce trade',
      },
      immigrationPolicy: {
        open: 'Rapid workforce growth boosts population and GDP',
        moderate: 'Selective immigration balances growth and stability',
        restricted: 'Slower workforce growth, but reduces unemployment',
      },
      envPolicy: {
        green: 'Boosts environmental score; reduces industry growth',
        balanced: 'Sustainable growth with moderate energy access',
        industrial: 'Maximizes energy output; lowers environmental score',
      },
    };
    return descriptions[key]?.[value] ?? '';
  }
}
