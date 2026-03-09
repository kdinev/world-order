import type { Country, CountryPreset } from '../models/game.model';

export type PresetTemplate = Omit<Country, 'id' | 'name' | 'code' | 'color' | 'isPlayer' | 'relations' | 'gdpHistory'>;

export interface CustomAllocation {
  economy: number;    // 0–80
  military: number;   // 0–80
  social: number;     // 0–80
  technology: number; // 0–80
  stability: number;  // 0–80
  resources: number;  // 0–80
}

export const CUSTOM_BUDGET = 336;

// ─── Dimension score formulas (for display bars, scale 0–80) ─────────────────
// economy   = round((businessClimate + corruptionIndex + min(gdpGrowthRate*15,100)) / 3)
// military  = militaryStrength
// social    = round((healthcareIndex + educationIndex + socialSupportIndex) / 3)
// technology= round((workforceSkillLevel + internetAccess) / 2)
// stability = round((politicalStability + pressFreedom) / 2)
// resources = round((energyAccess + environmentalScore + infrastructureIndex) / 3)
//
// Balanced target: ~337 total across all 6 dimensions for each preset.

export const PLAYER_PRESETS: Record<CountryPreset, PresetTemplate> = {
  // ─── Agricultural ── economy=59, military=38, social=55, tech=48, stab=62, res=75 → 337
  agricultural: {
    preset: 'agricultural',
    gdp: 60,
    gdpPerCapita: 2000,
    gdpGrowthRate: 4.2,
    inflation: 5.2,
    nationalDebt: 50,
    fdi: 5,
    exports: 22,
    imports: 24,
    businessClimate: 58,
    corruptionIndex: 56,
    sectors: { agriculture: 44, industry: 22, services: 20, technology: 3, energy: 5, tourism: 6 },
    population: 30,
    populationGrowthRate: 1.8,
    lifeExpectancy: 68,
    literacyRate: 74,
    urbanizationRate: 46,
    youthPercent: 36,
    workingPercent: 57,
    elderlyPercent: 7,
    unemploymentRate: 12.0,
    workforceSkillLevel: 50,
    laborProductivity: 45,
    healthcareIndex: 52,
    educationIndex: 56,
    socialSupportIndex: 57,
    crimeIndex: 52,
    happinessIndex: 48,
    hdi: 0.620,
    infrastructureIndex: 69,
    energyAccess: 84,
    internetAccess: 46,
    environmentalScore: 72,
    militaryStrength: 38,
    politicalStability: 62,
    pressFreedom: 62,
    religiousFreedom: 62,
    budgets: { healthcare: 16, education: 20, military: 10, infrastructure: 22, socialPrograms: 20, research: 12 },
    policies: { taxRate: 20, tradePolicy: 'moderate', immigrationPolicy: 'open', envPolicy: 'green' },
  },
  // ─── Industrial ── economy=56, military=50, social=58, tech=55, stab=60, res=58 → 337
  industrial: {
    preset: 'industrial',
    gdp: 200,
    gdpPerCapita: 5263,
    gdpGrowthRate: 3.2,
    inflation: 3.5,
    nationalDebt: 58,
    fdi: 14,
    exports: 88,
    imports: 86,
    businessClimate: 62,
    corruptionIndex: 58,
    sectors: { agriculture: 9, industry: 44, services: 30, technology: 8, energy: 6, tourism: 3 },
    population: 38,
    populationGrowthRate: 0.5,
    lifeExpectancy: 74,
    literacyRate: 90,
    urbanizationRate: 68,
    youthPercent: 21,
    workingPercent: 66,
    elderlyPercent: 13,
    unemploymentRate: 8.0,
    workforceSkillLevel: 58,
    laborProductivity: 52,
    healthcareIndex: 58,
    educationIndex: 60,
    socialSupportIndex: 56,
    crimeIndex: 44,
    happinessIndex: 54,
    hdi: 0.760,
    infrastructureIndex: 56,
    energyAccess: 66,
    internetAccess: 52,
    environmentalScore: 52,
    militaryStrength: 50,
    politicalStability: 62,
    pressFreedom: 58,
    religiousFreedom: 72,
    budgets: { healthcare: 17, education: 17, military: 16, infrastructure: 18, socialPrograms: 18, research: 14 },
    policies: { taxRate: 30, tradePolicy: 'moderate', immigrationPolicy: 'moderate', envPolicy: 'balanced' },
  },
  // ─── Militaristic ── economy=46, military=75, social=52, tech=55, stab=50, res=58 → 336
  militaristic: {
    preset: 'militaristic',
    gdp: 100,
    gdpPerCapita: 4000,
    gdpGrowthRate: 2.5,
    inflation: 5.5,
    nationalDebt: 65,
    fdi: 6,
    exports: 38,
    imports: 42,
    businessClimate: 54,
    corruptionIndex: 46,
    sectors: { agriculture: 12, industry: 36, services: 26, technology: 10, energy: 10, tourism: 6 },
    population: 25,
    populationGrowthRate: 0.8,
    lifeExpectancy: 70,
    literacyRate: 84,
    urbanizationRate: 60,
    youthPercent: 26,
    workingPercent: 65,
    elderlyPercent: 9,
    unemploymentRate: 10.0,
    workforceSkillLevel: 58,
    laborProductivity: 52,
    healthcareIndex: 50,
    educationIndex: 52,
    socialSupportIndex: 54,
    crimeIndex: 50,
    happinessIndex: 46,
    hdi: 0.700,
    infrastructureIndex: 54,
    energyAccess: 68,
    internetAccess: 52,
    environmentalScore: 52,
    militaryStrength: 75,
    politicalStability: 52,
    pressFreedom: 48,
    religiousFreedom: 50,
    budgets: { healthcare: 12, education: 12, military: 30, infrastructure: 16, socialPrograms: 16, research: 14 },
    policies: { taxRate: 26, tradePolicy: 'protected', immigrationPolicy: 'restricted', envPolicy: 'industrial' },
  },
  // ─── Custom ── placeholder (overridden by buildCustomPreset at game start)
  custom: {
    preset: 'custom',
    gdp: 130,
    gdpPerCapita: 3411,
    gdpGrowthRate: 3.3,
    inflation: 4.2,
    nationalDebt: 56,
    fdi: 9,
    exports: 54,
    imports: 56,
    businessClimate: 57,
    corruptionIndex: 55,
    sectors: { agriculture: 20, industry: 32, services: 28, technology: 8, energy: 7, tourism: 5 },
    population: 38,
    populationGrowthRate: 1.0,
    lifeExpectancy: 71,
    literacyRate: 80,
    urbanizationRate: 58,
    youthPercent: 28,
    workingPercent: 63,
    elderlyPercent: 9,
    unemploymentRate: 9.5,
    workforceSkillLevel: 56,
    laborProductivity: 50,
    healthcareIndex: 56,
    educationIndex: 56,
    socialSupportIndex: 56,
    crimeIndex: 48,
    happinessIndex: 52,
    hdi: 0.700,
    infrastructureIndex: 56,
    energyAccess: 72,
    internetAccess: 56,
    environmentalScore: 59,
    militaryStrength: 56,
    politicalStability: 56,
    pressFreedom: 56,
    religiousFreedom: 60,
    budgets: { healthcare: 16, education: 16, military: 18, infrastructure: 17, socialPrograms: 17, research: 16 },
    policies: { taxRate: 25, tradePolicy: 'moderate', immigrationPolicy: 'moderate', envPolicy: 'balanced' },
  },
};

// ─── Preset Info ──────────────────────────────────────────────────────────────

export interface PresetStat { key: string; label: string; value: number; }

export interface PresetInfoEntry {
  label: string;
  icon: string;
  tagline: string;
  description: string;
  pros: string[];
  cons: string[];
  stats: PresetStat[];
}

export const PRESET_INFO: Record<CountryPreset, PresetInfoEntry> = {
  agricultural: {
    label: 'Agrarian Republic',
    icon: '🌾',
    tagline: 'Fertile lands, growing ambitions',
    description:
      "Your nation's backbone is its vast farmlands. Rich in natural resources and a large rural population, you must modernise infrastructure and diversify your economy to lift millions out of poverty and climb the world rankings.",
    pros: [
      'Highest growth rate (+4.2%/yr)',
      'Strong environment & natural resources',
      'Large, young working population',
    ],
    cons: [
      'Low starting GDP ($60B)',
      'Weak military — early vulnerability',
    ],
    stats: [
      { key: 'economy',    label: 'Economy',    value: 59 },
      { key: 'military',   label: 'Military',   value: 38 },
      { key: 'social',     label: 'Social',     value: 55 },
      { key: 'technology', label: 'Technology', value: 48 },
      { key: 'stability',  label: 'Stability',  value: 62 },
      { key: 'resources',  label: 'Resources',  value: 75 },
    ],
  },
  industrial: {
    label: 'Industrial State',
    icon: '🏭',
    tagline: 'Steel and ambition',
    description:
      'Your factories run day and night. With a solid industrial base and urban workforce, the challenge is to upgrade skills, reduce corruption, attract foreign capital, and transition into high-value sectors before rivals outpace you.',
    pros: [
      'Largest starting GDP ($200B)',
      'Balanced across all dimensions',
      'Skilled urban workforce',
    ],
    cons: [
      'Moderate growth ceiling (3.2%)',
      'Below-average environmental score',
    ],
    stats: [
      { key: 'economy',    label: 'Economy',    value: 56 },
      { key: 'military',   label: 'Military',   value: 50 },
      { key: 'social',     label: 'Social',     value: 58 },
      { key: 'technology', label: 'Technology', value: 55 },
      { key: 'stability',  label: 'Stability',  value: 60 },
      { key: 'resources',  label: 'Resources',  value: 58 },
    ],
  },
  militaristic: {
    label: 'Militaristic Republic',
    icon: '⚔️',
    tagline: 'Strength is order',
    description:
      "Your nation commands respect through its formidable armed forces. High defence spending provides stability but strains social programmes. Redirect power towards economic growth, forge alliances, and build prosperity without losing your edge.",
    pros: [
      "Dominant military — region's chief deterrent",
      'High internal security',
    ],
    cons: [
      'Strained social programmes',
      'Low press freedom — diplomatic friction',
      'Slowest economic growth (2.5%)',
    ],
    stats: [
      { key: 'economy',    label: 'Economy',    value: 46 },
      { key: 'military',   label: 'Military',   value: 75 },
      { key: 'social',     label: 'Social',     value: 52 },
      { key: 'technology', label: 'Technology', value: 55 },
      { key: 'stability',  label: 'Stability',  value: 50 },
      { key: 'resources',  label: 'Resources',  value: 58 },
    ],
  },
  custom: {
    label: 'Custom Nation',
    icon: '⚙️',
    tagline: 'Your vision, your rules',
    description:
      'Distribute 336 points across six dimensions to craft your ideal starting nation. Shape your economy, military, society, technology, stability, and resources — no constraints, just your strategy.',
    pros: [],
    cons: [],
    stats: [],
  },
};

// ─── Custom Preset Builder ────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function normalize100(values: number[]): number[] {
  const sum = values.reduce((s, v) => s + v, 0);
  if (sum === 0) return values.map(() => 0);
  const normalized = values.map(v => Math.round((v / sum) * 100));
  // Fix rounding drift on the last element
  const diff = 100 - normalized.reduce((s, v) => s + v, 0);
  normalized[normalized.length - 1] += diff;
  return normalized;
}

export function buildCustomPreset(a: CustomAllocation): PresetTemplate {
  const E  = clamp(a.economy,    0, 80);
  const M  = clamp(a.military,   0, 80);
  const S  = clamp(a.social,     0, 80);
  const T  = clamp(a.technology, 0, 80);
  const St = clamp(a.stability,  0, 80);
  const R  = clamp(a.resources,  0, 80);

  // ── Economy stats
  const businessClimate  = clamp(Math.round(15 + E * 0.75),   15, 100);
  const corruptionIndex  = clamp(Math.round(20 + E * 0.6875), 20, 100);
  const gdpGrowthRate    = Math.round((1.0 + E * 0.05) * 10) / 10;
  const gdp              = clamp(Math.round(50 + E * 1.875),  50, 200);
  const inflation        = Math.max(1.5, Math.round((6.5 - E * 0.0375) * 10) / 10);
  const nationalDebt     = clamp(Math.round(75 - E * 0.375),  20, 90);
  const fdi              = clamp(Math.round(3 + E * 0.1375),   3, 15);
  const exports          = clamp(Math.round(20 + E * 0.875),  20, 90);
  const imports          = Math.round(exports * 1.05);

  // ── Military stats
  const militaryStrength = clamp(Math.round(8 + M * 0.8375),  8, 80);

  // ── Social stats
  const healthcareIndex    = clamp(Math.round(20 + S * 0.7),      20, 80);
  const educationIndex     = clamp(Math.round(20 + S * 0.75),     20, 82);
  const socialSupportIndex = clamp(Math.round(15 + S * 0.65),     15, 75);
  const happinessIndex     = clamp(Math.round(30 + S * 0.45),     30, 68);
  const crimeIndex         = clamp(Math.round(70 - S * 0.4),      35, 70);
  const lifeExpectancy     = clamp(Math.round(55 + S * 0.35 + E * 0.05), 55, 88);

  // ── Technology stats
  const workforceSkillLevel = clamp(Math.round(15 + T * 0.7),      15, 72);
  const internetAccess      = clamp(Math.round(10 + T * 0.7),      10, 68);
  const laborProductivity   = Math.round(workforceSkillLevel * 0.9);
  const literacyRate        = clamp(Math.round(55 + T * 0.45),     55, 92);

  // ── Stability stats
  const politicalStability = clamp(Math.round(18 + St * 0.7), 18, 76);
  const pressFreedom       = clamp(Math.round(18 + St * 0.7), 18, 76);
  const religiousFreedom   = clamp(Math.round(30 + St * 0.5), 30, 72);

  // ── Resources stats
  const energyAccess       = clamp(Math.round(30 + R * 0.75),      30, 92);
  const environmentalScore = clamp(Math.round(20 + R * 0.6875),    20, 76);
  const infrastructureIndex = clamp(Math.round(15 + R * 0.7),      15, 72);
  const urbanizationRate   = clamp(Math.round(35 + R * 0.625),     35, 88);

  // ── Derived demographics
  const population         = clamp(Math.round(18 + (E + S) * 0.1875), 18, 50);
  const gdpPerCapita       = Math.round((gdp / population) * 1000);
  const populationGrowthRate = Math.max(0.1, Math.round((2.8 - E * 0.02 + S * 0.008) * 10) / 10);
  const youthPercent       = clamp(Math.round(32 - S * 0.18), 12, 40);
  const elderlyPercent     = clamp(Math.round(6  + S * 0.08),  6, 18);
  const workingPercent     = 100 - youthPercent - elderlyPercent;
  const unemploymentRate   = Math.max(2.0, Math.round((18 - (E + T) * 0.1) * 10) / 10);

  const hdi = Math.round(clamp(
    (lifeExpectancy - 20) / 65 * 0.33
    + (literacyRate / 100 + educationIndex / 100) / 2 * 0.33
    + Math.log(Math.max(gdpPerCapita, 100)) / Math.log(75000) * 0.34,
    0.3, 0.95,
  ) * 1000) / 1000;

  // ── Sectors (normalised to 100)
  const rawAgri    = Math.max(2, Math.round(38 - E * 0.33));
  const rawIndus   = Math.max(5, Math.round(12 + M * 0.25));
  const rawServ    = Math.max(10, Math.round(18 + S * 0.22));
  const rawTech    = Math.max(1, Math.round(2 + T * 0.125));
  const rawEnergy  = Math.max(2, Math.round(4 + R * 0.09));
  const rawTour    = Math.max(1, 100 - rawAgri - rawIndus - rawServ - rawTech - rawEnergy);
  const [agriculture, industry, services, technology, energy, tourism] =
    normalize100([rawAgri, rawIndus, rawServ, rawTech, rawEnergy, Math.max(1, rawTour)]);

  // ── Budgets (normalised to 100)
  const rawMilBudget    = 10 + Math.round(M * 0.25);
  const rawHealthBudget = 10 + Math.round(S * 0.1);
  const rawEduBudget    = 10 + Math.round(S * 0.125);
  const rawInfraBudget  = 10 + Math.round(R * 0.1);
  const rawSocialBudget = 10 + Math.round(S * 0.075);
  const rawResearch     = Math.max(5, 100 - rawMilBudget - rawHealthBudget - rawEduBudget - rawInfraBudget - rawSocialBudget);
  const [military, healthcare, education, infrastructure, socialPrograms, research] =
    normalize100([rawMilBudget, rawHealthBudget, rawEduBudget, rawInfraBudget, rawSocialBudget, rawResearch]);

  const taxRate = clamp(Math.round(18 + E * 0.275), 18, 40);

  return {
    preset: 'custom',
    gdp,
    gdpPerCapita,
    gdpGrowthRate,
    inflation,
    nationalDebt,
    fdi,
    exports,
    imports,
    businessClimate,
    corruptionIndex,
    sectors: { agriculture, industry, services, technology, energy, tourism },
    population,
    populationGrowthRate,
    lifeExpectancy,
    literacyRate,
    urbanizationRate,
    youthPercent,
    workingPercent,
    elderlyPercent,
    unemploymentRate,
    workforceSkillLevel,
    laborProductivity,
    healthcareIndex,
    educationIndex,
    socialSupportIndex,
    crimeIndex,
    happinessIndex,
    hdi,
    infrastructureIndex,
    energyAccess,
    internetAccess,
    environmentalScore,
    militaryStrength,
    politicalStability,
    pressFreedom,
    religiousFreedom,
    budgets: { healthcare, education, military, infrastructure, socialPrograms, research },
    policies: {
      taxRate,
      tradePolicy:      E >= 50 ? 'open'       : M >= 50 ? 'protected'  : 'moderate',
      immigrationPolicy: S >= 50 ? 'open'       : M >= 50 ? 'restricted' : 'moderate',
      envPolicy:         R >= 55 ? 'green'      : E >= 55 ? 'industrial' : 'balanced',
    },
  };
}
