import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to map backend document structure to frontend structure to preserve UI
const mapDocument = (doc) => {
  if (!doc) return null;

  // Fallback icon mapping based on category or slug
  let icon = '📄';
  if (doc.slug?.includes('pan')) icon = '💳';
  else if (doc.slug?.includes('aadhaar')) icon = '🆔';
  else if (doc.slug?.includes('passport')) icon = '🛂';
  else if (doc.slug?.includes('income') || doc.category === 'Income & Taxes') icon = '📜';
  else if (doc.slug?.includes('domicile') || doc.slug?.includes('property')) icon = '🏠';
  else if (doc.slug?.includes('voter')) icon = '🗳️';
  else if (doc.slug?.includes('dl') || doc.category === 'Vehicle') icon = '🚗';

  return {
    id: doc.slug,
    title: doc.name,
    description: doc.description,
    icon: icon,
    category: doc.category,
    tags: [doc.category], // Backend doesn't have tags, use category as a tag
    overview: doc.description,
    eligibility: doc.eligibility || [],
    requiredDocuments: [
      {
        category: 'General',
        items: doc.requiredDocuments || []
      }
    ],
    process: {
      online: {
        portalName: doc.officialWebsite ? 'Official Portal' : 'N/A',
        portalLink: doc.officialWebsite || '#',
        docRequirements: 'Check official portal for specific requirements.',
        steps: doc.onlineSteps || []
      },
      offline: {
        centerInfo: 'Check local government offices.',
        docRequirements: 'Carry original and photocopies.',
        steps: doc.offlineSteps || []
      }
    },
    // Map the string fee to an array for the sidebar
    fees: [
      { type: 'General', amount: doc.fees || 'Free' }
    ],
    processingTime: doc.processingTime || 'Varies',
    faq: doc.faqs || []
  };
};

export const documentService = {
  /**
   * Fetch all documents
   */
  getAllDocuments: async () => {
    const response = await apiClient.get('/documents');
    const docs = response.data?.data?.documents || [];
    return docs.map(mapDocument);
  },

  /**
   * Fetch a single document by slug
   * @param {string} slug 
   */
  getDocumentBySlug: async (slug) => {
    const response = await apiClient.get(`/documents/${slug}`);
    const doc = response.data?.data?.document;
    return mapDocument(doc);
  },

  /**
   * Search documents
   * @param {string} query 
   */
  searchDocuments: async (query) => {
    const response = await apiClient.get(`/documents/search?q=${encodeURIComponent(query)}`);
    const docs = response.data?.data?.documents || [];
    return docs.map(mapDocument);
  }
};
