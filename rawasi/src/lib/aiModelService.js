// src/lib/aiModelService.js
// Service to interact with the AI model API

const API_BASE_URL =
  import.meta.env.VITE_MODEL_API_URL || "http://localhost:5000";
/**
 * Predict project cost using the trained AI model
 * @param {Object} projectData - Project information
 * @returns {Promise<Object>} - Prediction results
 */
export async function predictProjectCost(projectData) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_type: projectData.type,
        size_sqm: projectData.sizeSqm,
        location: projectData.location,
        timeline_months: projectData.timelineMonths,
        rate_sar_m2: calculateRateSarM2(projectData)
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error predicting project cost:', error);
    throw error;
  }
}

/**
 * Calculate rate per square meter based on project characteristics
 * This is a helper function to estimate the rate if not provided
 */
function calculateRateSarM2(project) {
  // Base rates by project type (SAR per sqm)
  const baseRates = {
    'Residential': 750,
    'Commercial': 900,
    'Industrial': 600,
    'Mixed-Use': 850
  };

  let rate = baseRates[project.type] || 750;

  // Adjust based on location (rough estimates)
  const locationMultipliers = {
    'Riyadh': 1.0,
    'Jeddah': 0.95,
    'Dammam': 0.9,
    'Mecca': 1.05,
    'Medina': 1.0
  };

  rate *= locationMultipliers[project.location] || 1.0;

  // Adjust based on complexity (if you have it)
  const complexityMultipliers = {
    'low': 0.9,
    'medium': 1.0,
    'high': 1.15
  };

  rate *= complexityMultipliers[project.complexity] || 1.0;

  // Adjust based on selected technologies (premium tech = higher rate)
  if (project.techNeeds && project.techNeeds.length > 0) {
    const premiumTechs = ['BIM', 'Prefabrication', '3D panel system (M2)', 'Modular LGS'];
    const hasPremiumTech = project.techNeeds.some(tech => premiumTechs.includes(tech));
    if (hasPremiumTech) {
      rate *= 1.1;
    }
  }

  return Math.round(rate);
}

/**
 * Batch predict multiple projects
 * @param {Array} projects - Array of project data
 * @returns {Promise<Object>} - Batch prediction results
 */
export async function batchPredictProjects(projects) {
  try {
    const response = await fetch(`${API_BASE_URL}/batch-predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projects: projects.map(p => ({
          project_type: p.type,
          size_sqm: p.sizeSqm,
          location: p.location,
          timeline_months: p.timelineMonths,
          rate_sar_m2: calculateRateSarM2(p)
        }))
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in batch prediction:', error);
    throw error;
  }
}

/**
 * Check API health
 * @returns {Promise<Object>} - Health status
 */
export async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error checking API health:', error);
    return { status: 'unhealthy', error: error.message };
  }
}

export default {
  predictProjectCost,
  batchPredictProjects,
  checkAPIHealth
};