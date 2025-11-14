// src/lib/aiModelService.js - ML Model Integration
/**
 * AI Model Service
 * Connects React frontend to Flask ML model API for cost predictions
 */

const MODEL_API_URL = import.meta.env.VITE_MODEL_API_URL || 'http://localhost:5000';

/**
 * Predict project cost using the trained ML model
 * @param {Object} project - Project details
 * @returns {Promise<Object>} Prediction results
 */
export async function predictProjectCost(project) {
  try {
    console.log('🤖 Calling ML Model API for cost prediction...');
    console.log('📊 Project data:', project);

    // Prepare request data matching the model API format
    const requestData = {
      project_type: project.type || 'Residential',
      size_sqm: parseFloat(project.sizeSqm) || 1500,
      location: project.location || 'Riyadh',
      timeline_months: parseInt(project.timelineMonths) || 12,
      rate_sar_m2: 750.0 // Default construction rate - can be made dynamic
    };

    console.log('📤 Sending to model:', requestData);

    // Call the model API
    const response = await fetch(`${MODEL_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Model API returned ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Model prediction received:', result);

    if (!result.success) {
      throw new Error(result.error || 'Prediction failed');
    }

    // Return the prediction in the format expected by the frontend
    return {
      success: true,
      predicted_cost: result.predicted_cost,
      confidence_interval: {
        lower: result.confidence_interval.lower,
        upper: result.confidence_interval.upper
      },
      cost_per_sqm: result.cost_per_sqm,
      model_inputs: result.inputs,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Model prediction error:', error);

    // Return error with fallback
    return {
      success: false,
      error: error.message,
      fallback_estimate: calculateFallbackEstimate(project),
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Batch predict costs for multiple projects
 * @param {Array<Object>} projects - Array of project details
 * @returns {Promise<Object>} Batch prediction results
 */
export async function batchPredictProjectCosts(projects) {
  try {
    console.log(`🤖 Batch predicting costs for ${projects.length} projects...`);

    const requestProjects = projects.map(project => ({
      project_type: project.type || 'Residential',
      size_sqm: parseFloat(project.sizeSqm) || 1500,
      location: project.location || 'Riyadh',
      timeline_months: parseInt(project.timelineMonths) || 12,
      rate_sar_m2: 750.0
    }));

    const response = await fetch(`${MODEL_API_URL}/batch-predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projects: requestProjects }),
    });

    if (!response.ok) {
      throw new Error(`Model API returned ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Batch predictions received');

    return {
      success: true,
      predictions: result.predictions,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Batch prediction error:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Check if the model API is healthy
 * @returns {Promise<Object>} Health check result
 */
export async function checkModelHealth() {
  try {
    const response = await fetch(`${MODEL_API_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Model API is not responding');
    }

    const result = await response.json();
    console.log('✅ Model API health check:', result);

    return {
      success: true,
      status: result.status,
      model_loaded: result.model_loaded,
      api_url: MODEL_API_URL
    };

  } catch (error) {
    console.error('❌ Model health check failed:', error);
    return {
      success: false,
      error: error.message,
      api_url: MODEL_API_URL
    };
  }
}

/**
 * Fallback cost estimation when model is unavailable
 * @param {Object} project - Project details
 * @returns {number} Estimated cost
 */
function calculateFallbackEstimate(project) {
  // Simple rule-based estimation
  const baseRates = {
    'Residential': 3500,
    'Commercial': 4500,
    'Industrial': 3800,
    'Mixed-Use': 4200
  };

  const baseRate = baseRates[project.type] || 4000;
  const sizeSqm = parseFloat(project.sizeSqm) || 1500;

  // Add complexity factor based on timeline
  const timelineMonths = parseInt(project.timelineMonths) || 12;
  const urgencyMultiplier = timelineMonths < 10 ? 1.15 : 1.0;

  const estimatedCost = baseRate * sizeSqm * urgencyMultiplier;

  return Math.round(estimatedCost);
}

/**
 * Get cost breakdown by project phase
 * @param {number} totalCost - Total project cost
 * @param {string} projectType - Type of project
 * @returns {Object} Cost breakdown
 */
export function getCostBreakdown(totalCost, projectType) {
  // Typical cost distribution percentages
  const distributions = {
    'Residential': {
      design: 0.05,
      foundation: 0.15,
      structure: 0.35,
      finishing: 0.30,
      mep: 0.15
    },
    'Commercial': {
      design: 0.08,
      foundation: 0.12,
      structure: 0.30,
      finishing: 0.25,
      mep: 0.25
    },
    'Industrial': {
      design: 0.06,
      foundation: 0.18,
      structure: 0.40,
      finishing: 0.20,
      mep: 0.16
    },
    'Mixed-Use': {
      design: 0.07,
      foundation: 0.14,
      structure: 0.33,
      finishing: 0.28,
      mep: 0.18
    }
  };

  const dist = distributions[projectType] || distributions['Residential'];

  return {
    design: Math.round(totalCost * dist.design),
    foundation: Math.round(totalCost * dist.foundation),
    structure: Math.round(totalCost * dist.structure),
    finishing: Math.round(totalCost * dist.finishing),
    mep: Math.round(totalCost * dist.mep),
    total: totalCost
  };
}

/**
 * Calculate timeline estimate based on project size and cost
 * @param {Object} project - Project details
 * @param {number} predictedCost - Predicted project cost
 * @returns {Object} Timeline estimates
 */
export function calculateTimelineEstimate(project, predictedCost) {
  const sizeSqm = parseFloat(project.sizeSqm) || 1500;

  // Base timeline calculation (months per 1000 sqm)
  const baseMonthsPer1000Sqm = 6;
  const estimatedMonths = Math.ceil((sizeSqm / 1000) * baseMonthsPer1000Sqm);

  // Add buffer based on project complexity
  const complexityBuffer = {
    'Residential': 1.0,
    'Commercial': 1.2,
    'Industrial': 1.15,
    'Mixed-Use': 1.25
  };

  const multiplier = complexityBuffer[project.type] || 1.0;
  const adjustedMonths = Math.round(estimatedMonths * multiplier);

  return {
    estimated_months: adjustedMonths,
    min_months: Math.max(adjustedMonths - 2, 6),
    max_months: adjustedMonths + 3,
    phases: {
      design: Math.ceil(adjustedMonths * 0.15),
      procurement: Math.ceil(adjustedMonths * 0.10),
      construction: Math.ceil(adjustedMonths * 0.65),
      finishing: Math.ceil(adjustedMonths * 0.10)
    }
  };
}

/**
 * Test the model connection
 * @returns {Promise<Object>} Test result
 */
export async function testModelConnection() {
  try {
    console.log('🔧 Testing ML Model API connection...');

    // Test health endpoint
    const health = await checkModelHealth();

    if (!health.success) {
      return {
        success: false,
        error: 'Health check failed',
        details: health
      };
    }

    // Test prediction with sample data
    const testProject = {
      type: 'Residential',
      sizeSqm: 1500,
      location: 'Riyadh',
      timelineMonths: 12
    };

    const prediction = await predictProjectCost(testProject);

    return {
      success: prediction.success,
      health_check: health,
      sample_prediction: prediction,
      message: prediction.success
        ? '✅ Model API is working correctly!'
        : '⚠️ Model API responded but prediction failed'
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: '❌ Could not connect to Model API'
    };
  }
}

export default {
  predictProjectCost,
  batchPredictProjectCosts,
  checkModelHealth,
  getCostBreakdown,
  calculateTimelineEstimate,
  testModelConnection
};