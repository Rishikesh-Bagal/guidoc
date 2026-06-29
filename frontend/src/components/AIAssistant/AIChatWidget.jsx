import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import axios from 'axios';
import ChatMessage from './ChatMessage';
import SuggestedQuestions from './SuggestedQuestions';
import './AIChatWidget.css';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am the GUIDOC Assistant. How can I help you with your government documents today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/ai/chat', {
        message: text
      });
      
      setMessages(prev => [...prev, { role: 'bot', content: response.data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      let errorMsg = 'Sorry, I am having trouble connecting to the server. Please try again later.';
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      setMessages(prev => [...prev, { role: 'bot', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="ai-chat-widget">
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={toggleChat} aria-label="Open AI Assistant">
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <MessageCircle size={24} />
              <div>
                <h3 className="chat-header-title">GUIDOC Assistant</h3>
                <p className="chat-header-subtitle">Official Government Guidance</p>
              </div>
            </div>
            <button className="chat-close-btn" onClick={toggleChat}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && (
              <div className="chat-message-wrapper bot">
                <div className="avatar bot">
                  <MessageCircle size={20} />
                </div>
                <div className="message-bubble bot">
                  <div className="typing-indicator">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && !isLoading && (
            <SuggestedQuestions onSelect={sendMessage} />
          )}

          <form className="chat-input-area" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about documents..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="chat-send-btn" 
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
