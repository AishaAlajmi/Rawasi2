// ai.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const GENAI_API_KEY = import.meta.env.Gemini;

const genAI = new GoogleGenerativeAI(GENAI_API_KEY);

// Cache for provider recommendations
const recommendationCache = new Map();

export async function llmRankProviders(project, providers) {
  const cacheKey = JSON.stringify({
    name: project.name,
    type: project.type,
    size: project.sizeSqm,
    location: project.location,
    complexity: project.complexity,
    budget: project.budget,
    timeline: project.timelineMonths
  });

  // Check cache first
  if (recommendationCache.has(cacheKey)) {
    return recommendationCache.get(cacheKey);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    You are a construction technology expert in Saudi Arabia. Analyze this project and rank the most suitable providers.

    PROJECT DETAILS:
    - Name: ${project.name}
    - Type: ${project.type}
    - Size: ${project.sizeSqm} sqm
    - Location: ${project.location}
    - Complexity: ${project.complexity}
    - Budget: ${project.budget} SAR
    - Timeline: ${project.timelineMonths} months
    - Preferred Technologies: ${project.techNeeds?.join(', ') || 'Not specified'}

    AVAILABLE PROVIDERS (in JSON format):
    ${JSON.stringify(providers.slice(0, 10), null, 2)}

    CRITERIA FOR RANKING:
    1. Technology match (30%) - How well provider's tech matches project needs
    2. Budget compatibility (25%) - Provider's cost structure vs project budget
    3. Location efficiency (15%) - Geographic proximity and local experience
    4. Project size experience (15%) - Experience with similar scale projects
    5. Timeline capability (15%) - Ability to meet project schedule

    SAUDI-SPECIFIC CONSIDERATIONS:
    - Local regulations and building codes compliance
    - Climate adaptability (heat, sand, etc.)
    - Local supply chain and manufacturing presence
    - Cultural and business practices understanding

    Return ONLY a JSON array of provider IDs sorted by suitability score (best first), with a "reason" field explaining why each provider is suitable.

    Format: [{"id": "provider1", "reason": "Detailed explanation..."}, ...]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const rankedProviders = JSON.parse(jsonMatch[0]);
      
      // Map back to full provider data with scores
      const enhancedProviders = rankedProviders.map(ranked => {
        const fullProvider = providers.find(p => p.id === ranked.id);
        if (fullProvider) {
          return {
            ...fullProvider,
            finalScore: 0.9 - (rankedProviders.indexOf(ranked) * 0.1), // Best gets 0.9, next 0.8, etc.
            aiReason: ranked.reason
          };
        }
        return null;
      }).filter(Boolean);

      // Cache the result
      recommendationCache.set(cacheKey, enhancedProviders);
      return enhancedProviders;
    }
  } catch (error) {
    console.warn('Gemini API failed, falling back to heuristic ranking:', error);
  }

  // Fallback to heuristic ranking
  return heuristicRankProviders(project, providers);
}

// Fallback heuristic ranking
function heuristicRankProviders(project, providers) {
  return providers.map(provider => {
    let score = 0;
    const reasons = [];

    // Technology match (30%)
    const techMatch = calculateTechMatch(provider.technologies, project.techNeeds);
    score += techMatch * 0.3;
    if (techMatch > 0.7) reasons.push("Excellent technology match");

    // Budget compatibility (25%)
    const budgetScore = calculateBudgetScore(provider, project);
    score += budgetScore * 0.25;
    if (budgetScore > 0.8) reasons.push("Good budget alignment");

    // Location efficiency (15%)
    const locationScore = calculateLocationScore(provider, project);
    score += locationScore * 0.15;
    if (locationScore > 0.8) reasons.push("Optimal location");

    // Project size experience (15%)
    const sizeScore = calculateSizeScore(provider, project);
    score += sizeScore * 0.15;
    if (sizeScore > 0.7) reasons.push("Relevant project scale experience");

    // Timeline capability (15%)
    const timelineScore = calculateTimelineScore(provider, project);
    score += timelineScore * 0.15;
    if (timelineScore > 0.8) reasons.push("Can meet timeline");

    return {
      ...provider,
      finalScore: Math.min(1, score),
      aiReason: reasons.join(". ") || "Good overall match based on project requirements"
    };
  }).sort((a, b) => b.finalScore - a.finalScore);
}

// Helper functions for heuristic scoring
function calculateTechMatch(providerTech, projectTechNeeds) {
  if (!projectTechNeeds?.length) return 0.5;
  
  const providerTechSet = new Set(providerTech.map(t => t.toLowerCase()));
  const matches = projectTechNeeds.filter(need => 
    providerTechSet.has(need.toLowerCase())
  ).length;
  
  return matches / projectTechNeeds.length;
}

function calculateBudgetScore(provider, project) {
  const estimatedCost = (provider.baseCost || 0) + (provider.costPerSqm || 0) * project.sizeSqm;
  const budgetRatio = project.budget / estimatedCost;
  
  if (budgetRatio >= 1.2) return 1.0; // Well within budget
  if (budgetRatio >= 0.9) return 0.8; // Slightly over but acceptable
  if (budgetRatio >= 0.7) return 0.5; // Might be tight
  return 0.2; // Likely over budget
}

function calculateLocationScore(provider, project) {
  // Prefer providers in the same city or region
  const providerLocation = provider.location?.toLowerCase() || '';
  const projectLocation = project.location?.toLowerCase() || '';
  
  if (providerLocation.includes(projectLocation) || projectLocation.includes(providerLocation)) {
    return 1.0;
  }
  
  // Same region bonus
  const regions = {
    'riyadh': ['riyadh', 'central'],
    'jeddah': ['jeddah', 'makkah', 'western'],
    'dammam': ['dammam', 'eastern', 'khobar', 'dhahran']
  };
  
  for (const [key, cities] of Object.entries(regions)) {
    if (cities.some(city => projectLocation.includes(city)) && 
        cities.some(city => providerLocation.includes(city))) {
      return 0.8;
    }
  }
  
  return 0.5; // Different region
}

function calculateSizeScore(provider, project) {
  const typicalSize = provider.typicalProjectSize || 1000;
  const sizeDiff = Math.abs(typicalSize - project.sizeSqm);
  const sizeRatio = sizeDiff / typicalSize;
  
  if (sizeRatio <= 0.3) return 1.0; // Very similar size
  if (sizeRatio <= 0.6) return 0.7; // Moderately different
  return 0.3; // Very different size
}

function calculateTimelineScore(provider, project) {
  const typicalTimeline = provider.typicalTimelineMonths || 12;
  const timelineDiff = Math.abs(typicalTimeline - project.timelineMonths);
  const timelineRatio = timelineDiff / typicalTimeline;
  
  if (timelineRatio <= 0.2) return 1.0; // Very similar timeline
  if (timelineRatio <= 0.4) return 0.7; // Moderately different
  return 0.3; // Very different timeline
}