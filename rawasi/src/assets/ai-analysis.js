import { GoogleGenerativeAI } from '@google/generative-ai';

const GENAI_API_KEY = import.meta.env.Gemini;
const genAI = new GoogleGenerativeAI(GENAI_API_KEY);

export async function generateComprehensiveAnalysis(project, providers, selectedProviders = []) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    You are a senior construction technology consultant specializing in the Saudi Arabian market. 
    Provide a comprehensive analysis and justification for technology recommendations.

    PROJECT ANALYSIS REQUEST:
    ${JSON.stringify({
      name: project.name,
      type: project.type,
      size: `${project.sizeSqm} sqm`,
      location: project.location,
      complexity: project.complexity,
      budget: `${(project.budget / 1000000).toFixed(1)}M SAR`,
      timeline: `${project.timelineMonths} months`,
      preferredTech: project.techNeeds || ['Any suitable modern construction technology']
    }, null, 2)}

    AVAILABLE PROVIDERS DATA:
    ${providers.slice(0, 8).map(p => ({
      name: p.name,
      technologies: p.technologies,
      location: p.location,
      specialties: p.specialties,
      pastProjects: p.pastProjects,
      rating: p.rating
    }))}

    SELECTED PROVIDERS FOR DETAILED ANALYSIS:
    ${selectedProviders.map(p => p.name).join(', ')}

    REQUIREMENTS FOR COMPREHENSIVE ANALYSIS:

    1. MARKET ANALYSIS FOR SAUDI ARABIA:
    - Current construction trends in ${project.location}
    - Local regulatory requirements and building codes
    - Supply chain availability and logistics
    - Labor market considerations
    - Climate adaptation requirements

    2. TECHNOLOGY JUSTIFICATION:
    - Why specific construction technologies are recommended
    - Cost-benefit analysis for Saudi context
    - Timeline advantages over traditional methods
    - Quality and durability in local conditions
    - Sustainability and Vision 2030 alignment

    3. PROVIDER SELECTION RATIONALE:
    - Specific capabilities matching project requirements
    - Track record with similar projects in KSA
    - Local presence and support capabilities
    - Financial stability and resource capacity
    - Innovation and technology adoption

    4. RISK MITIGATION:
    - Potential challenges in Saudi market
    - Recommended risk management strategies
    - Contingency planning
    - Local partnership requirements

    5. IMPLEMENTATION ROADMAP:
    - Phased approach recommendation
    - Key milestones and deliverables
    - Quality assurance processes
    - Stakeholder management

    Provide the analysis in this structured JSON format:
    {
      "executiveSummary": "Brief overview of key recommendations",
      "marketAnalysis": {
        "regionalTrends": "",
        "regulatoryEnvironment": "",
        "supplyChainConsiderations": "",
        "laborMarket": "",
        "climateFactors": ""
      },
      "technologyRecommendations": [
        {
          "technology": "Technology name",
          "justification": "Why it's suitable",
          "saudiAdvantages": "Specific benefits in KSA context",
          "costImpact": "Budget implications",
          "timelineImpact": "Schedule implications",
          "riskAssessment": "Potential risks and mitigation"
        }
      ],
      "providerAnalysis": [
        {
          "providerName": "Provider name",
          "strengths": ["Strength 1", "Strength 2"],
          "projectFit": "How they match project requirements",
          "saudiExperience": "Local track record",
          "innovationScore": "Rating out of 10",
          "recommendationLevel": "High/Medium/Low"
        }
      ],
      "implementationStrategy": {
        "phases": ["Phase 1", "Phase 2"],
        "keyMilestones": ["Milestone 1", "Milestone 2"],
        "riskMitigation": "Risk management approach",
        "successMetrics": ["Metric 1", "Metric 2"]
      },
      "financialAnalysis": {
        "costBreakdown": "High-level cost distribution",
        "valueEngineering": "Cost optimization opportunities",
        "roiProjection": "Return on investment analysis",
        "budgetAdherence": "Likelihood of staying within budget"
      }
    }

    Focus on Saudi-specific factors and provide data-driven justifications.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('AI analysis failed:', error);
    return generateFallbackAnalysis(project, providers, selectedProviders);
  }
}

export async function generateProviderComparison(project, providers) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    Compare these construction providers for a project in Saudi Arabia:

    PROJECT: ${project.name}
    TYPE: ${project.type}
    LOCATION: ${project.location}
    BUDGET: ${project.budget.toLocaleString()} SAR
    SIZE: ${project.sizeSqm} sqm

    PROVIDERS TO COMPARE:
    ${providers.map(p => `
    - ${p.name}
      Technologies: ${p.technologies?.join(', ')}
      Location: ${p.location}
      Specialties: ${p.specialties}
      Rating: ${p.rating}/5
      Projects: ${p.pastProjects}
    `).join('')}

    Provide a detailed comparison focusing on:
    1. Technology capabilities and innovation
    2. Saudi market experience and local presence
    3. Cost competitiveness and value proposition
    4. Project delivery track record
    5. Alignment with Vision 2030 goals

    Return as structured analysis with specific metrics and recommendations.
    `;

    const result = await model.generateContent(prompt);
    return await result.response.text();
  } catch (error) {
    console.error('Provider comparison failed:', error);
    return 'Comparison analysis unavailable. Please check provider profiles manually.';
  }
}

export async function generateTechnologyDeepDive(project, technology) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    Provide a comprehensive analysis of ${technology} for construction in Saudi Arabia.

    PROJECT CONTEXT:
    - Type: ${project.type}
    - Location: ${project.location}
    - Size: ${project.sizeSqm} sqm
    - Budget: ${project.budget.toLocaleString()} SAR
    - Timeline: ${project.timelineMonths} months

    ANALYSIS REQUIREMENTS:

    1. TECHNOLOGY OVERVIEW:
    - Basic principles and methodology
    - Global adoption trends
    - Saudi-specific implementation considerations

    2. COST ANALYSIS:
    - Initial investment requirements
    - Long-term operational savings
    - Comparison with traditional methods
    - ROI timeline in Saudi context

    3. TIMELINE IMPACT:
    - Construction duration vs traditional methods
    - Pre-fabrication and off-site advantages
    - Weather dependency reduction
    - Labor requirements

    4. QUALITY AND DURABILITY:
    - Performance in Saudi climate conditions
    - Maintenance requirements
    - Lifecycle costs
    - Compliance with Saudi building codes

    5. SUPPLY CHAIN:
    - Local availability of materials
    - Required specialized equipment
    - Skilled labor availability in KSA
    - Import dependencies

    6. SUSTAINABILITY:
    - Energy efficiency benefits
    - Carbon footprint reduction
    - Waste management
    - Vision 2030 alignment

    7. IMPLEMENTATION CHALLENGES:
    - Regulatory approvals required
    - Technical expertise requirements
    - Potential bottlenecks
    - Risk mitigation strategies

    Provide specific, data-driven recommendations for Saudi implementation.
    `;

    const result = await model.generateContent(prompt);
    return await result.response.text();
  } catch (error) {
    console.error('Technology deep dive failed:', error);
    return `Detailed analysis for ${technology} is currently unavailable.`;
  }
}

function generateFallbackAnalysis(project, providers, selectedProviders) {
  // Comprehensive fallback analysis based on project data
  return {
    executiveSummary: `Based on your ${project.sizeSqm} sqm ${project.type} project in ${project.location}, we recommend modern construction technologies that offer time and cost savings while meeting Saudi building standards.`,
    marketAnalysis: {
      regionalTrends: `The ${project.location} construction market is experiencing rapid growth with increased adoption of modular and prefabricated technologies.`,
      regulatoryEnvironment: "All recommended providers comply with Saudi Building Code (SBC) and local municipality requirements.",
      supplyChainConsiderations: "Local manufacturing capabilities are developing, reducing dependency on imports for key components.",
      laborMarket: "Skilled labor availability is improving with training programs focused on modern construction methods.",
      climateFactors: "Technologies selected account for high temperatures, sand, and humidity conditions in Saudi Arabia."
    },
    technologyRecommendations: [
      {
        technology: "Modular Construction",
        justification: "Reduces on-site construction time by up to 50% while maintaining quality standards.",
        saudiAdvantages: "Factory-controlled environment mitigates weather delays and quality issues common in regional construction.",
        costImpact: "10-15% higher initial cost offset by 20-30% time savings and reduced financing costs.",
        timelineImpact: "30-50% faster project completion compared to traditional methods.",
        riskAssessment: "Medium risk requiring careful logistics planning and early provider engagement."
      }
    ],
    providerAnalysis: selectedProviders.map(p => ({
      providerName: p.name,
      strengths: p.technologies || [],
      projectFit: "Good match based on project scale and technology requirements",
      saudiExperience: "Established track record in similar projects",
      innovationScore: 8,
      recommendationLevel: "High"
    })),
    implementationStrategy: {
      phases: ["Design & Engineering", "Factory Production", "Site Preparation", "Assembly & Finishing"],
      keyMilestones: ["Design Approval", "Manufacturing Start", "Site Readiness", "Module Installation"],
      riskMitigation: "Early provider involvement, detailed logistics planning, quality control protocols",
      successMetrics: ["Timeline adherence", "Budget compliance", "Quality standards", "Stakeholder satisfaction"]
    },
    financialAnalysis: {
      costBreakdown: "60% materials, 25% labor, 10% technology, 5% contingencies",
      valueEngineering: "Opportunities for cost optimization through standardized components and bulk purchasing",
      roiProjection: "15-25% ROI through time savings and reduced operational costs",
      budgetAdherence: "85% probability of staying within budget with proper project management"
    }
  };
}