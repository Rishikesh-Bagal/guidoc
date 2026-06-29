const aiService = require('../services/ai.service');

const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const reply = await aiService.generateChatResponse(message);

    res.status(200).json({ reply });
  } catch (error) {
    console.error('AI Controller Error:', error);
    if (error.message.includes('Gemini API key is missing')) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

module.exports = {
  chat
};
