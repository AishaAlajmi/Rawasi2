// recommend.js
import { llmRankProviders } from './ai.js';

// Original scoring function (keep as fallback)
export function scoreProvider(provider, project) {
  if (!project) return 0.5;

  let score = 0;
  
  // Technology match (30%)
  const techMatch = calculateTechMatch(provider.technologies, project.techNeeds);
  score += techMatch * 0.3;
  
  // Budget fit (25%)
  const estCost = (provider.baseCost || 0) + (provider.costPerSqm || 0) * project.sizeSqm;
  const budgetFit = Math.min(1, project.budget / estCost);
  score += budgetFit * 0.25;
  
  // Location (20%)
  const locationScore = provider.location?.toLowerCase().includes(project.location?.toLowerCase()) ? 1 : 0.3;
  score += locationScore * 0.2;
  
  // Experience with project type (15%)
  const typeExperience = provider.projectTypes?.includes(project.type) ? 1 : 0.5;
  score += typeExperience * 0.15;
  
  // Timeline (10%)
  const timelineScore = project.timelineMonths >= (provider.minTimeline || 6) ? 1 : 0.3;
  score += timelineScore * 0.1;
  
  return Math.min(1, score);
}

function calculateTechMatch(providerTech, projectTechNeeds) {
  if (!projectTechNeeds?.length) return 0.5;
  
  const providerTechSet = new Set(providerTech.map(t => t.toLowerCase()));
  const matches = projectTechNeeds.filter(need => 
    providerTechSet.has(need.toLowerCase())
  ).length;
  
  return matches / projectTechNeeds.length;
}

// Enhanced cost and time estimation for Saudi market
export function estimateCostAndTime(project) {
  const baseRates = {
    Residential: { costPerSqm: 4500, monthsPer1000Sqm: 3 },
    Commercial: { costPerSqm: 6000, monthsPer1000Sqm: 4 },
    Industrial: { costPerSqm: 3500, monthsPer1000Sqm: 2.5 },
    'Mixed-Use': { costPerSqm: 5200, monthsPer1000Sqm: 3.5 }
  };

  const rates = baseRates[project.type] || baseRates.Residential;
  
  // Adjust for complexity
  const complexityMultipliers = {
    low: { cost: 0.9, time: 0.9 },
    medium: { cost: 1.0, time: 1.0 },
    high: { cost: 1.3, time: 1.4 }
  };
  
  const multiplier = complexityMultipliers[project.complexity] || complexityMultipliers.medium;
  
  // Adjust for location (Riyadh is baseline)
  const locationMultipliers = {
    Riyadh: 1.0,
    Jeddah: 1.1,
    Dammam: 1.05,
    Mecca: 1.15,
    Medina: 1.12
  };
  
  const locationMultiplier = locationMultipliers[project.location] || 1.0;

  const baseCost = rates.costPerSqm * project.sizeSqm;
  const adjustedCost = baseCost * multiplier.cost * locationMultiplier;
  
  const baseTime = (project.sizeSqm / 1000) * rates.monthsPer1000Sqm;
  const adjustedTime = baseTime * multiplier.time;

  // Risk calculation based on budget vs estimated cost
  const costRisk = Math.max(0, adjustedCost - project.budget) / project.budget;
  const timeRisk = Math.max(0, adjustedTime - project.timelineMonths) / project.timelineMonths;
  const totalRisk = (costRisk + timeRisk) / 2;

  return {
    estCost: Math.round(adjustedCost),
    estTimeMonths: Math.round(adjustedTime * 10) / 10,
    risk: Math.min(1, totalRisk)
  };
}

// Get top 3 AI-recommended providers
export async function getTopRecommendations(project, providers, count = 3) {
  try {
    const ranked = await llmRankProviders(project, providers);
    return ranked.slice(0, count);
  } catch (error) {
    console.error('AI recommendation failed:', error);
    // Fallback to heuristic ranking
    return providers
      .map(p => ({ ...p, score: scoreProvider(p, project) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }
}