import { generateComprehensiveAnalysis, generateProviderComparison, generateTechnologyDeepDive } from './ai-analysis.js';

export class AdvancedRecommendationEngine {
  constructor(project, providers) {
    this.project = project;
    this.providers = providers;
    this.analysisCache = new Map();
  }

  async generateMasterRecommendationReport() {
    const cacheKey = `master-${JSON.stringify(this.project)}`;
    if (this.analysisCache.has(cacheKey)) {
      return this.analysisCache.get(cacheKey);
    }

    // Get top 3 providers for detailed analysis
    const topProviders = this.getTopProviders(3);
    
    try {
      const analysis = await generateComprehensiveAnalysis(
        this.project, 
        this.providers, 
        topProviders
      );

      // Enhance with additional calculations
      const enhancedAnalysis = {
        ...analysis,
        calculatedMetrics: this.calculateProjectMetrics(),
        saudiMarketIntelligence: this.getSaudiMarketIntelligence(),
        technologyAdoptionRoadmap: this.generateAdoptionRoadmap(),
        riskAssessment: this.performRiskAssessment(topProviders)
      };

      this.analysisCache.set(cacheKey, enhancedAnalysis);
      return enhancedAnalysis;

    } catch (error) {
      console.error('Master report generation failed:', error);
      return this.generateComprehensiveFallback(topProviders);
    }
  }

  async generateProviderSpotlight(providerId) {
    const provider = this.providers.find(p => p.id === providerId);
    if (!provider) return null;

    try {
      const technologyAnalysis = await Promise.all(
        (provider.technologies || []).map(tech => 
          generateTechnologyDeepDive(this.project, tech)
        )
      );

      return {
        providerProfile: provider,
        technologyAnalyses: technologyAnalysis,
        projectSpecificAdvantages: this.calculateProviderAdvantages(provider),
        saudiCompetitiveness: this.assessSaudiCompetitiveness(provider),
        implementationReadiness: this.assessImplementationReadiness(provider)
      };
    } catch (error) {
      console.error('Provider spotlight failed:', error);
      return this.generateProviderFallback(provider);
    }
  }

  async generateComparativeAnalysis(providerIds) {
    const selectedProviders = providerIds.map(id => 
      this.providers.find(p => p.id === id)
    ).filter(Boolean);

    try {
      const comparison = await generateProviderComparison(this.project, selectedProviders);
      
      return {
        rawComparison: comparison,
        scoredComparison: this.scoreProviderComparison(selectedProviders),
        recommendationMatrix: this.createRecommendationMatrix(selectedProviders),
        riskProfiles: selectedProviders.map(p => this.assessProviderRisk(p))
      };
    } catch (error) {
      console.error('Comparative analysis failed:', error);
      return this.generateComparisonFallback(selectedProviders);
    }
  }

  // Advanced scoring algorithms
  calculateProjectMetrics() {
    const { type, sizeSqm, complexity, location, budget, timelineMonths } = this.project;
    
    const complexityMultipliers = {
      low: 1.0,
      medium: 1.2,
      high: 1.5
    };

    const locationMultipliers = {
      'Riyadh': 1.0,
      'Jeddah': 1.15,
      'Dammam': 1.1,
      'Mecca': 1.25,
      'Medina': 1.2
    };

    const baseCostPerSqm = {
      'Residential': 4500,
      'Commercial': 6000,
      'Industrial': 3500,
      'Mixed-Use': 5200
    };

    const baseCost = (baseCostPerSqm[type] || 4500) * sizeSqm;
    const adjustedCost = baseCost * 
      complexityMultipliers[complexity] * 
      (locationMultipliers[location] || 1.0);

    return {
      budgetAdequacyScore: Math.min(1, budget / adjustedCost),
      timelineFeasibility: Math.min(1, (timelineMonths * 4) / (sizeSqm / 100)),
      complexityFactor: complexityMultipliers[complexity],
      marketCompetitiveness: this.assessMarketCompetitiveness(),
      technologyReadiness: this.assessTechnologyReadiness()
    };
  }

  getSaudiMarketIntelligence() {
    const { location, type } = this.project;
    
    const marketData = {
      'Riyadh': {
        growthRate: '8.2% annually',
        keyDrivers: ['Vision 2030 projects', 'Population growth', 'Commercial expansion'],
        challenges: ['Labor availability', 'Material costs', 'Regulatory compliance'],
        opportunities: ['Smart city initiatives', 'Sustainable construction', 'Technology adoption']
      },
      'Jeddah': {
        growthRate: '7.5% annually',
        keyDrivers: ['Tourism development', 'Port infrastructure', 'Commercial real estate'],
        challenges: ['Humidity corrosion', 'Logistics complexity', 'Space constraints'],
        opportunities: ['Coastal construction tech', 'Tourism infrastructure', 'Mixed-use development']
      },
      'Dammam': {
        growthRate: '6.8% annually',
        keyDrivers: ['Industrial expansion', 'Energy sector', 'Port development'],
        challenges: ['Industrial regulations', 'Environmental compliance', 'Specialized labor'],
        opportunities: ['Industrial modular construction', 'Energy-efficient designs', 'Port infrastructure']
      }
    };

    return marketData[location] || marketData.Riyadh;
  }

  generateAdoptionRoadmap() {
    const phases = [
      {
        phase: 'Technology Selection',
        duration: '2-4 weeks',
        activities: [
          'Detailed technology assessment',
          'Provider capability evaluation',
          'Cost-benefit analysis',
          'Regulatory compliance check'
        ],
        deliverables: ['Technology recommendation report', 'Provider shortlist']
      },
      {
        phase: 'Design Integration',
        duration: '4-6 weeks',
        activities: [
          'Architectural integration',
          'Engineering design',
          'Value engineering',
          'Stakeholder approval'
        ],
        deliverables: ['Integrated design documents', 'Value engineering report']
      },
      {
        phase: 'Implementation Planning',
        duration: '2-3 weeks',
        activities: [
          'Detailed scheduling',
          'Logistics planning',
          'Quality control protocols',
          'Risk mitigation planning'
        ],
        deliverables: ['Master implementation plan', 'Risk register']
      }
    ];

    return phases;
  }

  performRiskAssessment(providers) {
    const risks = [
      {
        category: 'Technology',
        risks: [
          'New technology adoption resistance',
          'Skills gap in workforce',
          'Supply chain dependencies'
        ],
        mitigation: ['Early training programs', 'Local partnerships', 'Dual sourcing']
      },
      {
        category: 'Regulatory',
        risks: [
          'Building code compliance',
          'Municipal approval delays',
          'Environmental regulations'
        ],
        mitigation: ['Early authority engagement', 'Expert consultation', 'Compliance tracking']
      },
      {
        category: 'Market',
        risks: [
          'Material price volatility',
          'Labor market fluctuations',
          'Currency exchange impacts'
        ],
        mitigation: ['Fixed-price contracts', 'Local sourcing', 'Currency hedging']
      }
    ];

    return {
      riskCategories: risks,
      overallRiskLevel: this.calculateOverallRisk(providers),
      recommendedActions: this.generateRiskMitigationActions()
    };
  }

  // Helper methods
  getTopProviders(count) {
    return this.providers
      .map(p => ({
        ...p,
        score: this.calculateProviderScore(p)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  calculateProviderScore(provider) {
    let score = 0;
    
    // Technology match (30%)
    const techMatch = this.calculateTechMatch(provider.technologies, this.project.techNeeds);
    score += techMatch * 0.3;
    
    // Budget compatibility (20%)
    const budgetScore = this.calculateBudgetScore(provider);
    score += budgetScore * 0.2;
    
    // Location efficiency (15%)
    const locationScore = this.calculateLocationScore(provider);
    score += locationScore * 0.15;
    
    // Experience (15%)
    const experienceScore = Math.min(1, (provider.pastProjects || 0) / 50);
    score += experienceScore * 0.15;
    
    // Saudi presence (10%)
    const saudiScore = provider.location?.includes('Saudi') ? 1 : 0.3;
    score += saudiScore * 0.1;
    
    // Innovation (10%)
    const innovationScore = (provider.technologies?.length || 0) > 2 ? 0.8 : 0.4;
    score += innovationScore * 0.1;

    return Math.min(1, score);
  }

  calculateTechMatch(providerTech, projectTechNeeds) {
    if (!projectTechNeeds?.length) return 0.6;
    
    const providerTechSet = new Set(providerTech.map(t => t.toLowerCase()));
    const matches = projectTechNeeds.filter(need => 
      providerTechSet.has(need.toLowerCase())
    ).length;
    
    return matches / Math.max(1, projectTechNeeds.length);
  }

  calculateBudgetScore(provider) {
    const estimatedCost = (provider.baseCost || 0) + (provider.costPerSqm || 0) * this.project.sizeSqm;
    const budgetRatio = this.project.budget / estimatedCost;
    
    if (budgetRatio >= 1.3) return 1.0;
    if (budgetRatio >= 1.1) return 0.9;
    if (budgetRatio >= 0.9) return 0.7;
    if (budgetRatio >= 0.7) return 0.4;
    return 0.1;
  }

  calculateLocationScore(provider) {
    const providerLocation = provider.location?.toLowerCase() || '';
    const projectLocation = this.project.location?.toLowerCase() || '';
    
    if (providerLocation.includes(projectLocation)) return 1.0;
    
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
    
    return providerLocation.includes('saudi') ? 0.6 : 0.3;
  }

  // Fallback methods
  generateComprehensiveFallback(topProviders) {
    return {
      executiveSummary: `Based on analysis of your ${this.project.type} project in ${this.project.location}, we recommend modern construction approaches that balance innovation with proven Saudi market experience.`,
      calculatedMetrics: this.calculateProjectMetrics(),
      topProviders: topProviders.map(p => ({
        name: p.name,
        recommendationReason: this.generateFallbackReason(p),
        confidenceScore: this.calculateProviderScore(p)
      })),
      implementationConsiderations: this.generateFallbackImplementationPlan()
    };
  }

  generateFallbackReason(provider) {
    const reasons = [];
    
    if (provider.technologies?.some(t => this.project.techNeeds?.includes(t))) {
      reasons.push("Technology alignment with project requirements");
    }
    
    if (provider.location?.toLowerCase().includes(this.project.location.toLowerCase())) {
      reasons.push("Strong local presence and experience");
    }
    
    const costScore = this.calculateBudgetScore(provider);
    if (costScore > 0.7) {
      reasons.push("Competitive pricing within project budget");
    }
    
    return reasons.length > 0 ? reasons.join(". ") : "Good overall capability match";
  }

  generateFallbackImplementationPlan() {
    return {
      phase1: "Technology selection and provider finalization (2-3 weeks)",
      phase2: "Detailed design and engineering (4-6 weeks)",
      phase3: "Procurement and manufacturing (8-12 weeks)",
      phase4: "Site construction and assembly (12-20 weeks)",
      keySuccessFactors: [
        "Early stakeholder engagement",
        "Clear communication protocols",
        "Regular progress monitoring",
        "Quality assurance processes"
      ]
    };
  }
}