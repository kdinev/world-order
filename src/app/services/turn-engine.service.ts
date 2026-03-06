import { Injectable } from '@angular/core';
import type { Country, GameEvent, EventTemplate } from '../models/game.model';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(current: number, target: number, rate: number): number {
  return current + (target - current) * rate;
}

@Injectable({ providedIn: 'root' })
export class TurnEngineService {
  /** Calculate the annual GDP growth rate for a country based on its current state. */
  calcAnnualGdpGrowthRate(c: Country): number {
    let rate = 2.0; // base annual %

    rate += (c.businessClimate - 50) * 0.04;
    rate += (c.educationIndex - 50) * 0.02;
    rate += (c.workforceSkillLevel - 50) * 0.02;
    rate += (c.infrastructureIndex - 50) * 0.02;
    rate += (c.corruptionIndex - 50) * 0.02;
    rate += (c.politicalStability - 50) * 0.015;

    const tradeBalance = c.exports - c.imports;
    rate += (tradeBalance / Math.max(c.gdp, 1)) * 15;
    rate += (c.fdi / Math.max(c.gdp, 1)) * 10;

    rate += c.sectors.technology * 0.06;

    if (c.nationalDebt > 60) rate -= (c.nationalDebt - 60) * 0.05;
    if (c.inflation > 5) rate -= (c.inflation - 5) * 0.15;
    if (c.unemploymentRate > 5) rate -= (c.unemploymentRate - 5) * 0.08;

    if (c.policies.tradePolicy === 'open') rate += 0.4;
    if (c.policies.tradePolicy === 'protected') rate -= 0.3;

    return clamp(rate, -8, 14);
  }

  processCountry(c: Country, turn: number): Country {
    const annualGrowth = this.calcAnnualGdpGrowthRate(c);
    const quarterlyGrowth = annualGrowth / 4 / 100;

    const newGdp = c.gdp * (1 + quarterlyGrowth);
    const newPop = c.population * (1 + (this.effectivePopGrowth(c) / 4 / 100));

    const newGdpPerCapita = (newGdp * 1_000_000_000) / (newPop * 1_000_000);

    // Government revenue and spending
    const taxRate = c.policies.taxRate / 100;
    const budgetSum = Object.values(c.budgets).reduce((s, v) => s + v, 0);
    const spendingRatio = budgetSum / 100; // 1.0 = balanced, >1 = deficit
    const deficitPctGdp = Math.max(0, (spendingRatio - 1)) * taxRate * 100;
    const surplusPctGdp = Math.max(0, (1 - spendingRatio)) * taxRate * 100;
    const newDebt = clamp(c.nationalDebt + deficitPctGdp * 0.25 - surplusPctGdp * 0.25, 0, 200);

    // Sector-driven inflation
    const basePricePresure = c.populationGrowthRate * 0.3;
    const monetaryPresure = Math.max(0, deficitPctGdp * 0.5);
    const targetInflation = clamp(1.5 + basePricePresure + monetaryPresure, 0, 20);
    const newInflation = lerp(c.inflation, targetInflation, 0.1);

    // Unemployment: falls when growth > 2%, rises when growth < 0%
    const unempChange =
      annualGrowth > 2 ? -(annualGrowth - 2) * 0.1 : annualGrowth < 0 ? -annualGrowth * 0.2 : 0;
    const naturalUnemp = 3 + (100 - c.workforceSkillLevel) * 0.08;
    const newUnemp = lerp(c.unemploymentRate + unempChange, naturalUnemp, 0.02);
    const clampedUnemp = clamp(newUnemp, 1, 30);

    // Targets for social indices based on budget spending as % of GDP
    const spendPctOf = (share: number) => (share / 100) * taxRate * 100;
    const tHealthcare = clamp(spendPctOf(c.budgets.healthcare) * 10, 0, 100);
    const tEducation = clamp(spendPctOf(c.budgets.education) * 12, 0, 100);
    const tInfra = clamp(spendPctOf(c.budgets.infrastructure) * 12, 0, 100);
    const tSocial = clamp(spendPctOf(c.budgets.socialPrograms) * 10, 0, 100);
    const tMilitary = clamp(spendPctOf(c.budgets.military) * 8, 0, 100);
    const tResearch = clamp(spendPctOf(c.budgets.research) * 14, 0, 100);

    const conv = 0.05;
    const newHealthcare = lerp(c.healthcareIndex, tHealthcare, conv);
    const newEducation = lerp(c.educationIndex, tEducation, conv);
    const newInfra = lerp(c.infrastructureIndex, tInfra, conv);
    const newSocial = lerp(c.socialSupportIndex, tSocial, conv);
    const newMilitary = lerp(c.militaryStrength, tMilitary, conv);

    // Business climate: improves with low corruption, good infra, open trade; hurt by instability
    const tBusiness = clamp(
      20 + c.corruptionIndex * 0.4 + c.infrastructureIndex * 0.2 + c.politicalStability * 0.2,
      0,
      100,
    );
    const newBusiness = lerp(c.businessClimate, tBusiness, 0.04);

    // Workforce skill: driven by education + research spending
    const tSkill = clamp((newEducation + tResearch) / 2, 0, 100);
    const newSkillLevel = lerp(c.workforceSkillLevel, tSkill, 0.03);

    // Corruption improves with press freedom / democracy over time (slowly)
    const tCorruption = clamp(c.pressFreedom * 0.8 + c.politicalStability * 0.2, 0, 100);
    const newCorruption = lerp(c.corruptionIndex, tCorruption, 0.02);

    // Happiness: composite of several social factors
    const tHappiness = clamp(
      (newHealthcare + newEducation + newSocial - c.crimeIndex + c.environmentalScore) / 4.5,
      0,
      100,
    );
    const newHappiness = lerp(c.happinessIndex, tHappiness, 0.05);

    // HDI: composite index
    const lifeNorm = (c.lifeExpectancy - 20) / 65;
    const eduNorm = (c.literacyRate / 100 + newEducation / 100) / 2;
    const incomeNorm = Math.log(Math.max(newGdpPerCapita, 100)) / Math.log(75000);
    const newHdi = clamp((lifeNorm + eduNorm + incomeNorm) / 3, 0, 1);

    // Life expectancy slowly improves with healthcare
    const newLifeExp = lerp(c.lifeExpectancy, 45 + newHealthcare * 0.4, 0.02);

    // Literacy improves with education
    const newLiteracy = lerp(c.literacyRate, 50 + newEducation * 0.5, 0.03);

    // Crime: inverse of social support + policing (military/stability)
    const tCrime = clamp(80 - newSocial * 0.4 - c.politicalStability * 0.2 - newHealthcare * 0.1, 0, 100);
    const newCrime = lerp(c.crimeIndex, tCrime, 0.05);

    // Political stability: drifts toward medium unless events push it
    const newStability = lerp(c.politicalStability, 60, 0.01);

    // FDI slowly responds to business climate
    const tFdi = (newBusiness / 100) * newGdp * 0.12;
    const newFdi = lerp(c.fdi, tFdi, 0.08);

    // Trade grows with GDP
    const tradeGrowthFactor = 1 + quarterlyGrowth * 0.5;
    let newExports = c.exports * tradeGrowthFactor;
    let newImports = c.imports * tradeGrowthFactor;
    if (c.policies.tradePolicy === 'open') {
      newExports *= 1.002;
      newImports *= 1.002;
    } else if (c.policies.tradePolicy === 'protected') {
      newImports *= 0.998;
    }

    // GDP history (rolling 8 quarters)
    const newHistory = [...c.gdpHistory.slice(-7), Math.round(newGdp * 10) / 10];

    return {
      ...c,
      gdp: Math.round(newGdp * 10) / 10,
      gdpPerCapita: Math.round(newGdpPerCapita),
      gdpGrowthRate: Math.round(annualGrowth * 100) / 100,
      inflation: Math.round(newInflation * 10) / 10,
      nationalDebt: Math.round(newDebt * 10) / 10,
      fdi: Math.round(newFdi * 10) / 10,
      exports: Math.round(newExports * 10) / 10,
      imports: Math.round(newImports * 10) / 10,
      population: Math.round(newPop * 100) / 100,
      lifeExpectancy: Math.round(newLifeExp * 10) / 10,
      literacyRate: Math.round(newLiteracy * 10) / 10,
      unemploymentRate: Math.round(clampedUnemp * 10) / 10,
      workforceSkillLevel: Math.round(newSkillLevel * 10) / 10,
      laborProductivity: Math.round(lerp(c.laborProductivity, newSkillLevel * 0.9, 0.04) * 10) / 10,
      healthcareIndex: Math.round(newHealthcare * 10) / 10,
      educationIndex: Math.round(newEducation * 10) / 10,
      socialSupportIndex: Math.round(newSocial * 10) / 10,
      infrastructureIndex: Math.round(newInfra * 10) / 10,
      militaryStrength: Math.round(newMilitary * 10) / 10,
      businessClimate: Math.round(newBusiness * 10) / 10,
      corruptionIndex: Math.round(newCorruption * 10) / 10,
      crimeIndex: Math.round(clamp(newCrime, 0, 100) * 10) / 10,
      happinessIndex: Math.round(clamp(newHappiness, 0, 100) * 10) / 10,
      hdi: Math.round(clamp(newHdi, 0, 1) * 1000) / 1000,
      politicalStability: Math.round(clamp(newStability, 0, 100) * 10) / 10,
      // urbanization slowly increases
      urbanizationRate: Math.round(lerp(c.urbanizationRate, c.urbanizationRate + 0.1, 0.5) * 10) / 10,
      energyAccess: Math.round(lerp(c.energyAccess, 100, 0.005) * 10) / 10,
      internetAccess: Math.round(lerp(c.internetAccess, 100, 0.008) * 10) / 10,
      gdpHistory: newHistory,
    };
  }

  applyEventEffects(c: Country, events: GameEvent[], templates: EventTemplate[]): Country {
    let result = { ...c };
    for (const ev of events) {
      const tmpl = templates.find(t => t.id === ev.id);
      if (!tmpl) continue;
      const e = tmpl.effects;
      const clampField = (field: keyof Country, delta: number, lo: number, hi: number) => {
        (result as unknown as Record<string, number>)[field as string] = clamp(
          ((result as unknown as Record<string, number>)[field as string] as number) + delta,
          lo,
          hi,
        );
      };
      if (e.gdpGrowthRateDelta != null) result = { ...result, gdpGrowthRate: clamp(result.gdpGrowthRate + e.gdpGrowthRateDelta, -8, 14) };
      if (e.inflationDelta != null) clampField('inflation', e.inflationDelta, 0, 50);
      if (e.unemploymentDelta != null) clampField('unemploymentRate', e.unemploymentDelta, 0, 40);
      if (e.businessClimateDelta != null) clampField('businessClimate', e.businessClimateDelta, 0, 100);
      if (e.corruptionIndexDelta != null) clampField('corruptionIndex', e.corruptionIndexDelta, 0, 100);
      if (e.healthcareIndexDelta != null) clampField('healthcareIndex', e.healthcareIndexDelta, 0, 100);
      if (e.educationIndexDelta != null) clampField('educationIndex', e.educationIndexDelta, 0, 100);
      if (e.crimeIndexDelta != null) clampField('crimeIndex', e.crimeIndexDelta, 0, 100);
      if (e.happinessIndexDelta != null) clampField('happinessIndex', e.happinessIndexDelta, 0, 100);
      if (e.infrastructureIndexDelta != null) clampField('infrastructureIndex', e.infrastructureIndexDelta, 0, 100);
      if (e.militaryStrengthDelta != null) clampField('militaryStrength', e.militaryStrengthDelta, 0, 100);
      if (e.politicalStabilityDelta != null) clampField('politicalStability', e.politicalStabilityDelta, 0, 100);
      if (e.environmentalScoreDelta != null) clampField('environmentalScore', e.environmentalScoreDelta, 0, 100);
      if (e.nationalDebtDelta != null) clampField('nationalDebt', e.nationalDebtDelta, 0, 200);
      if (e.fdiDelta != null) clampField('fdi', e.fdiDelta, 0, 500);
      if (e.workforceSkillLevelDelta != null) clampField('workforceSkillLevel', e.workforceSkillLevelDelta, 0, 100);
      if (e.socialSupportIndexDelta != null) clampField('socialSupportIndex', e.socialSupportIndexDelta, 0, 100);
    }
    return result;
  }

  pickEvents(c: Country, templates: EventTemplate[], turn: number, maxEvents = 2): GameEvent[] {
    const totalWeight = templates.reduce((s, t) => s + t.weight, 0);
    const chosen: EventTemplate[] = [];

    // Use a deterministic-ish random based on country id + turn
    const seed = turn * 7919 + c.id.charCodeAt(0) * 31;
    const rng = (n: number) => ((seed * (n + 1) * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

    for (let i = 0; i < maxEvents; i++) {
      if (rng(i * 3) > 0.35) continue; // ~65% chance an event fires each slot
      let pick = rng(i * 3 + 1) * totalWeight;
      for (const t of templates) {
        pick -= t.weight;
        if (pick <= 0 && !chosen.some(x => x.id === t.id)) {
          chosen.push(t);
          break;
        }
      }
    }

    return chosen.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      type: t.type,
      severity: t.severity,
      countryId: c.id,
      turn,
    }));
  }

  private effectivePopGrowth(c: Country): number {
    let rate = c.populationGrowthRate;
    if (c.policies.immigrationPolicy === 'open') rate += 0.2;
    if (c.policies.immigrationPolicy === 'restricted') rate -= 0.1;
    rate += (c.healthcareIndex - 50) * 0.005;
    rate += (c.happinessIndex - 50) * 0.002;
    return clamp(rate, -1, 4);
  }
}
