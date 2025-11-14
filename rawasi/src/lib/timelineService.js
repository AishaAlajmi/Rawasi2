// src/lib/timelineService.js
/**
 * Service for predicting construction timeline using AI
 */

const TIMELINE_API_URL = import.meta.env.VITE_TIMELINE_API_URL || 'http://localhost:5002/api';

/**
 * Predict construction timeline based on project details
 * @param {Object} project - Project details
 * @returns {Promise<Object>} Timeline prediction result
 */
export async function predictTimeline(project) {
  try {
    const response = await fetch(`${TIMELINE_API_URL}/predict-timeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sizeSqm: project.sizeSqm || project.size_sqm || 1500,
        Nfloors: project.Nfloors || project.n_floors || 2,
        complexity: project.complexity || 3,
        techNeeds: project.techNeeds || project.tech_needs || [],
      }),
    });

    if (!response.ok) {
      throw new Error(`Timeline API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Timeline prediction failed');
    }

    return {
      success: true,
      predicted_months: data.predicted_months,
      area_sqm: data.area_sqm,
      num_floors: data.num_floors,
      complexity: data.complexity,
      techniques_used: data.techniques_used,
      method: data.method, // 'ai' or 'fallback'
    };
  } catch (error) {
    console.error('Timeline prediction error:', error);
    return {
      success: false,
      error: error.message,
      predicted_months: null,
    };
  }
}

/**
 * Check if timeline API is available
 * @returns {Promise<boolean>}
 */
export async function checkTimelineAPIHealth() {
  try {
    const response = await fetch(`${TIMELINE_API_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('Timeline API health check failed:', error);
    return false;
  }
}