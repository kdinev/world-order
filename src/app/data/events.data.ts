import type { EventTemplate } from '../models/game.model';

export const EVENT_TEMPLATES: EventTemplate[] = [
  // ─── Positive Economic ─────────────────────────────────────────────────────
  {
    id: 'tech_wave',
    title: 'Technology Innovation Wave',
    description:
      'Breakthrough innovations in your tech sector are attracting global attention and boosting productivity.',
    type: 'economic',
    severity: 'positive',
    weight: 8,
    effects: { gdpGrowthRateDelta: 1.5, businessClimateDelta: 6, workforceSkillLevelDelta: 3 },
  },
  {
    id: 'trade_surplus',
    title: 'Record Trade Surplus',
    description: 'Favourable global conditions have pushed your exports to record highs.',
    type: 'economic',
    severity: 'positive',
    weight: 7,
    effects: { gdpGrowthRateDelta: 1.0, nationalDebtDelta: -2, fdiDelta: 5 },
  },
  {
    id: 'fdi_rush',
    title: 'Foreign Investment Rush',
    description:
      'International investors are flooding into your country, attracted by stable policies and growth prospects.',
    type: 'economic',
    severity: 'positive',
    weight: 7,
    effects: { fdiDelta: 15, businessClimateDelta: 8, gdpGrowthRateDelta: 0.8 },
  },
  {
    id: 'industrial_modernization',
    title: 'Industrial Modernisation',
    description:
      'Major factories have completed a technological overhaul, significantly raising output per worker.',
    type: 'economic',
    severity: 'positive',
    weight: 6,
    effects: { gdpGrowthRateDelta: 0.7, businessClimateDelta: 5, unemploymentDelta: -0.5 },
  },
  {
    id: 'tourism_boom',
    title: 'Tourism Boom',
    description:
      'Your country has been voted the top tourist destination of the year, bringing in record visitor spending.',
    type: 'economic',
    severity: 'positive',
    weight: 6,
    effects: { gdpGrowthRateDelta: 0.6, happinessIndexDelta: 5, unemploymentDelta: -0.5 },
  },
  {
    id: 'resource_discovery',
    title: 'Natural Resource Discovery',
    description:
      'Geologists have confirmed significant deposits of valuable minerals in your territory.',
    type: 'economic',
    severity: 'positive',
    weight: 4,
    effects: { fdiDelta: 20, gdpGrowthRateDelta: 1.2, nationalDebtDelta: -3 },
  },
  {
    id: 'startup_ecosystem',
    title: 'Startup Ecosystem Flourishes',
    description:
      'A cluster of successful start-ups is transforming your country into a regional innovation hub.',
    type: 'economic',
    severity: 'positive',
    weight: 6,
    effects: { businessClimateDelta: 10, workforceSkillLevelDelta: 4, gdpGrowthRateDelta: 0.6 },
  },
  {
    id: 'infra_completion',
    title: 'Major Infrastructure Completed',
    description: 'A landmark transport and energy infrastructure project has been successfully delivered.',
    type: 'economic',
    severity: 'positive',
    weight: 5,
    effects: { infrastructureIndexDelta: 8, gdpGrowthRateDelta: 0.5, happinessIndexDelta: 4 },
  },
  // ─── Positive Social ───────────────────────────────────────────────────────
  {
    id: 'healthcare_breakthrough',
    title: 'Healthcare Breakthrough',
    description:
      'Domestic researchers have developed a widely praised medical treatment, improving public health outcomes.',
    type: 'social',
    severity: 'positive',
    weight: 6,
    effects: { healthcareIndexDelta: 8, happinessIndexDelta: 5, politicalStabilityDelta: 3 },
  },
  {
    id: 'crime_reduction',
    title: 'Crime Reduction Initiative Succeeds',
    description:
      'A multi-year effort to reform law enforcement and social services has led to a measurable drop in crime.',
    type: 'social',
    severity: 'positive',
    weight: 5,
    effects: { crimeIndexDelta: -10, happinessIndexDelta: 6, businessClimateDelta: 4 },
  },
  {
    id: 'education_award',
    title: 'Education Excellence Recognised',
    description:
      'International rankings have placed your country among the top performers in global education assessments.',
    type: 'social',
    severity: 'positive',
    weight: 5,
    effects: { educationIndexDelta: 6, workforceSkillLevelDelta: 5, happinessIndexDelta: 3 },
  },
  {
    id: 'cultural_renaissance',
    title: 'Cultural Renaissance',
    description:
      'A surge of artistic and cultural output is raising national pride and drawing global audiences.',
    type: 'social',
    severity: 'positive',
    weight: 6,
    effects: { happinessIndexDelta: 8, politicalStabilityDelta: 4, gdpGrowthRateDelta: 0.3 },
  },
  {
    id: 'env_success',
    title: 'Environmental Protection Success',
    description:
      'National reforestation and clean-energy programmes have received international praise.',
    type: 'social',
    severity: 'positive',
    weight: 5,
    effects: { environmentalScoreDelta: 10, happinessIndexDelta: 4, fdiDelta: 5 },
  },
  // ─── Negative Economic ────────────────────────────────────────────────────
  {
    id: 'financial_crash',
    title: 'Financial Market Crash',
    description:
      'A sudden collapse in asset prices has sent shockwaves through your financial system.',
    type: 'economic',
    severity: 'negative',
    weight: 5,
    effects: {
      gdpGrowthRateDelta: -2.0,
      businessClimateDelta: -12,
      nationalDebtDelta: 6,
      unemploymentDelta: 1.5,
    },
  },
  {
    id: 'trade_war',
    title: 'Trade War Escalation',
    description:
      'A major trading partner has imposed heavy tariffs, cutting off key export markets.',
    type: 'economic',
    severity: 'negative',
    weight: 7,
    effects: {
      gdpGrowthRateDelta: -1.0,
      businessClimateDelta: -6,
      fdiDelta: -8,
      inflationDelta: 1.0,
    },
  },
  {
    id: 'supply_chain',
    title: 'Supply Chain Disruption',
    description:
      'Global logistics crises are forcing manufacturers to halt production and raise consumer prices.',
    type: 'economic',
    severity: 'negative',
    weight: 8,
    effects: { gdpGrowthRateDelta: -0.6, inflationDelta: 2.0, businessClimateDelta: -4 },
  },
  {
    id: 'brain_drain',
    title: 'Brain Drain Crisis',
    description:
      'Thousands of your most skilled workers are emigrating in search of better opportunities abroad.',
    type: 'economic',
    severity: 'negative',
    weight: 6,
    effects: {
      workforceSkillLevelDelta: -8,
      gdpGrowthRateDelta: -0.6,
      businessClimateDelta: -5,
      unemploymentDelta: -0.5,
    },
  },
  {
    id: 'capital_flight',
    title: 'Foreign Capital Flight',
    description:
      'Uncertainty about the political situation is prompting foreign companies to pull investments.',
    type: 'economic',
    severity: 'negative',
    weight: 6,
    effects: { fdiDelta: -15, businessClimateDelta: -10, gdpGrowthRateDelta: -0.8 },
  },
  {
    id: 'corruption_scandal',
    title: 'Corruption Scandal Exposed',
    description:
      'A high-profile investigation has uncovered widespread corruption at the highest levels of government.',
    type: 'political',
    severity: 'negative',
    weight: 5,
    effects: {
      corruptionIndexDelta: -12,
      businessClimateDelta: -10,
      politicalStabilityDelta: -12,
      fdiDelta: -8,
    },
  },
  {
    id: 'mass_layoffs',
    title: 'Mass Layoffs Wave',
    description:
      'Major corporations have announced sweeping redundancies, throwing workers into uncertainty.',
    type: 'economic',
    severity: 'negative',
    weight: 7,
    effects: {
      unemploymentDelta: 2.5,
      crimeIndexDelta: 6,
      happinessIndexDelta: -8,
      socialSupportIndexDelta: -5,
    },
  },
  {
    id: 'energy_crisis',
    title: 'Energy Crisis',
    description:
      'Soaring fuel costs and grid instability are crippling industry and driving up the cost of living.',
    type: 'economic',
    severity: 'negative',
    weight: 6,
    effects: { gdpGrowthRateDelta: -0.8, inflationDelta: 2.5, happinessIndexDelta: -6 },
  },
  // ─── Negative Social / Natural ────────────────────────────────────────────
  {
    id: 'natural_disaster',
    title: 'Natural Disaster',
    description:
      'A devastating earthquake and subsequent floods have damaged key infrastructure and displaced communities.',
    type: 'natural',
    severity: 'negative',
    weight: 4,
    effects: {
      infrastructureIndexDelta: -14,
      gdpGrowthRateDelta: -0.7,
      nationalDebtDelta: 3,
      happinessIndexDelta: -8,
    },
  },
  {
    id: 'disease_outbreak',
    title: 'Disease Outbreak',
    description:
      'A fast-spreading infectious disease is straining healthcare resources and reducing workforce participation.',
    type: 'natural',
    severity: 'negative',
    weight: 4,
    effects: {
      healthcareIndexDelta: -10,
      gdpGrowthRateDelta: -0.8,
      unemploymentDelta: 1.0,
      happinessIndexDelta: -7,
    },
  },
  {
    id: 'civil_unrest',
    title: 'Civil Unrest Erupts',
    description:
      'Widespread protests over inequality and government policy are disrupting daily life in major cities.',
    type: 'political',
    severity: 'negative',
    weight: 6,
    effects: {
      politicalStabilityDelta: -14,
      businessClimateDelta: -8,
      crimeIndexDelta: 10,
      gdpGrowthRateDelta: -0.5,
    },
  },
  {
    id: 'drought',
    title: 'Severe Drought',
    description:
      'Prolonged drought is devastating agriculture, driving up food prices and rural unemployment.',
    type: 'natural',
    severity: 'negative',
    weight: 5,
    effects: {
      gdpGrowthRateDelta: -0.8,
      inflationDelta: 1.5,
      happinessIndexDelta: -5,
      environmentalScoreDelta: -4,
    },
  },
  {
    id: 'cyber_attack',
    title: 'Major Cyberattack',
    description:
      'State-sponsored hackers have crippled critical government and banking infrastructure.',
    type: 'military',
    severity: 'negative',
    weight: 4,
    effects: {
      businessClimateDelta: -8,
      infrastructureIndexDelta: -5,
      gdpGrowthRateDelta: -0.5,
      politicalStabilityDelta: -6,
    },
  },
  // ─── Neutral ──────────────────────────────────────────────────────────────
  {
    id: 'diplomatic_summit',
    title: 'International Diplomatic Summit',
    description:
      'World leaders are gathering in your capital for a high-profile summit on global cooperation.',
    type: 'diplomatic',
    severity: 'neutral',
    weight: 7,
    effects: { politicalStabilityDelta: 4, happinessIndexDelta: 3, fdiDelta: 3 },
  },
  {
    id: 'election',
    title: 'National Election',
    description:
      'Citizens head to the polls in a closely watched election that will shape policy for the coming years.',
    type: 'political',
    severity: 'neutral',
    weight: 5,
    effects: { politicalStabilityDelta: 3, happinessIndexDelta: 2 },
  },
  {
    id: 'cultural_festival',
    title: 'Grand International Cultural Festival',
    description:
      'Your country is hosting a landmark cultural event drawing millions of visitors and global media attention.',
    type: 'social',
    severity: 'neutral',
    weight: 7,
    effects: { happinessIndexDelta: 7, gdpGrowthRateDelta: 0.2, environmentalScoreDelta: -2 },
  },
  {
    id: 'census',
    title: 'National Census Published',
    description:
      'New demographic data refines national planning and highlights shifts in population distribution.',
    type: 'social',
    severity: 'neutral',
    weight: 6,
    effects: { politicalStabilityDelta: 1 },
  },
];
