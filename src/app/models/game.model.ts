export type CountryPreset = 'agricultural' | 'industrial' | 'militaristic' | 'custom';
export type DiplomaticStance = 'allied' | 'friendly' | 'neutral' | 'tense' | 'hostile' | 'war';
export type TradePolicy = 'open' | 'moderate' | 'protected';
export type ImmigrationPolicy = 'open' | 'moderate' | 'restricted';
export type EnvPolicy = 'green' | 'balanced' | 'industrial';
export type EventType = 'economic' | 'social' | 'natural' | 'political' | 'diplomatic' | 'military';
export type EventSeverity = 'positive' | 'neutral' | 'negative';

export interface Sectors {
  agriculture: number;
  industry: number;
  services: number;
  technology: number;
  energy: number;
  tourism: number;
}

export interface Budgets {
  healthcare: number;
  education: number;
  military: number;
  infrastructure: number;
  socialPrograms: number;
  research: number;
}

export interface Policies {
  taxRate: number;
  tradePolicy: TradePolicy;
  immigrationPolicy: ImmigrationPolicy;
  envPolicy: EnvPolicy;
}

export interface Relation {
  countryId: string;
  countryName: string;
  code: string;
  color: string;
  stance: DiplomaticStance;
  tradeAgreement: boolean;
  defenseAlliance: boolean;
  sanctionsActive: boolean;
  score: number;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  color: string;
  preset: CountryPreset;
  isPlayer: boolean;

  gdp: number;
  gdpPerCapita: number;
  gdpGrowthRate: number;
  inflation: number;
  nationalDebt: number;
  fdi: number;
  exports: number;
  imports: number;
  businessClimate: number;
  corruptionIndex: number;
  sectors: Sectors;

  population: number;
  populationGrowthRate: number;
  lifeExpectancy: number;
  literacyRate: number;
  urbanizationRate: number;
  youthPercent: number;
  workingPercent: number;
  elderlyPercent: number;

  unemploymentRate: number;
  workforceSkillLevel: number;
  laborProductivity: number;

  healthcareIndex: number;
  educationIndex: number;
  socialSupportIndex: number;
  crimeIndex: number;
  happinessIndex: number;
  hdi: number;

  infrastructureIndex: number;
  energyAccess: number;
  internetAccess: number;
  environmentalScore: number;

  militaryStrength: number;
  politicalStability: number;
  pressFreedom: number;
  religiousFreedom: number;

  budgets: Budgets;
  policies: Policies;
  relations: Relation[];
  gdpHistory: number[];
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  severity: EventSeverity;
  countryId: string;
  turn: number;
}

export interface GameState {
  started: boolean;
  turn: number;
  year: number;
  quarter: number;
  day: number;
  playerCountryId: string;
  countries: Country[];
  recentEvents: GameEvent[];
  allEvents: GameEvent[];
}

export interface EventTemplate {
  id: string;
  title: string;
  description: string;
  type: EventType;
  severity: EventSeverity;
  weight: number;
  effects: {
    gdpGrowthRateDelta?: number;
    inflationDelta?: number;
    unemploymentDelta?: number;
    businessClimateDelta?: number;
    corruptionIndexDelta?: number;
    healthcareIndexDelta?: number;
    educationIndexDelta?: number;
    crimeIndexDelta?: number;
    happinessIndexDelta?: number;
    infrastructureIndexDelta?: number;
    militaryStrengthDelta?: number;
    politicalStabilityDelta?: number;
    environmentalScoreDelta?: number;
    nationalDebtDelta?: number;
    fdiDelta?: number;
    workforceSkillLevelDelta?: number;
    socialSupportIndexDelta?: number;
  };
}
