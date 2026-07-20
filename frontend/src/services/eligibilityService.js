import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const eligibilityService = {
  /**
   * Check eligibility for a specific document
   * @param {string} document 
   * @param {Object} answers 
   * @returns {Object} Eligibility result data
   */
  checkEligibility: async (document, answers) => {
    try {
      const response = await apiClient.post('/eligibility', {
        document,
        answers
      });
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error, { cause: error });
      }
      throw error;
    }
  }
};
