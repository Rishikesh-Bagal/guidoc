import axios from 'axios';
import { auth } from '../config/firebase';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to attach Firebase auth token
apiClient.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
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
    id: doc._id || doc.slug, // Include mongo _id for admin operations
    slug: doc.slug,
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
    faq: doc.faqs || [],
    formUrl: doc.formUrl || null,
    importantNotes: doc.importantNotes || [],
    commonMistakes: doc.commonMistakes || [],
    tips: doc.tips || [],
    warnings: doc.warnings || [],
    officeInfo: doc.officeInfo || null,
    isActive: doc.isActive !== false,
    rawDoc: doc // Store raw doc for editing in admin
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
  },

  /**
   * Admin: Get all documents (including inactive)
   */
  getAdminDocuments: async (page = 1, limit = 50, q = '') => {
    const response = await apiClient.get(`/documents/admin/all?page=${page}&limit=${limit}&q=${encodeURIComponent(q)}`);
    return {
      documents: (response.data?.data?.documents || []).map(mapDocument),
      totalDocuments: response.data?.data?.totalDocuments || 0,
      totalPages: response.data?.data?.totalPages || 0,
      currentPage: response.data?.data?.currentPage || 1
    };
  },

  /**
   * Admin: Create document
   */
  createDocument: async (docData) => {
    const response = await apiClient.post('/documents', docData);
    return mapDocument(response.data?.data?.document);
  },

  /**
   * Admin: Update document
   */
  updateDocument: async (id, docData) => {
    const response = await apiClient.put(`/documents/${id}`, docData);
    return mapDocument(response.data?.data?.document);
  },

  /**
   * Admin: Delete document
   */
  deleteDocument: async (id) => {
    const response = await apiClient.delete(`/documents/${id}`);
    return response.data;
  }
};
