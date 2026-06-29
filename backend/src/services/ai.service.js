const { GoogleGenAI } = require('@google/genai');
const Document = require('../models/Document');

const generateChatResponse = async (message) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing. Please add GEMINI_API_KEY to your .env file.');
  }

  // Initialize the Gen AI SDK
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    // 1. Retrieve context from Document database
    // We do a simple text search to find the most relevant documents
    let docsContext = '';
    const relevantDocs = await Document.find(
      { $text: { $search: message } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(3)
      .select('name category description eligibility requiredDocuments fees processingTime officialWebsite officeInfo isActive')
      .lean();

    if (relevantDocs && relevantDocs.length > 0) {
      docsContext = 'Relevant Government Documents Data:\n\n' + relevantDocs.map(doc => {
        return `Document Name: ${doc.name}
Category: ${doc.category}
Description: ${doc.description}
Eligibility: ${doc.eligibility.join(', ')}
Required Documents: ${doc.requiredDocuments.join(', ')}
Fees: ${doc.fees}
Processing Time: ${doc.processingTime}
Official Website: ${doc.officialWebsite || 'N/A'}
Office Info: ${doc.officeInfo ? `${doc.officeInfo.officeType} - ${doc.officeInfo.officialDepartment}` : 'N/A'}
`;
      }).join('\n---\n');
    } else {
      // If no relevant docs found by text search, we can just supply a basic message or all docs if small
      docsContext = 'No specific document found in database for this query. Advise the user based on general Indian government procedures if possible, or politely ask for clarification.';
    }

    // 2. Construct the system instruction
    const systemInstruction = `You are the GUIDOC Assistant, a professional government guidance officer.
Your objective is to help users understand which document/service they need, eligibility, required documents, next steps, official portals, and nearby office recommendations.

CRITICAL RULES:
1. Answer ONLY government-document-related questions. If the user asks about something unrelated (e.g., weather, movies, coding), politely refuse.
2. Use the provided document database context to answer the user's question.
3. NEVER invent government rules or fake URLs.
4. Produce structured, trustworthy, and polite responses. Use markdown for readability (bullet points, bold text).
5. Always encourage users to verify information on official portals when applicable.

Context from GUIDOC Database:
${docsContext}
`;

    // 3. Call Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.3, // Low temperature for more factual responses
      }
    });

    return response.text;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate response from AI service.');
  }
};

module.exports = {
  generateChatResponse
};
