import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isBot = message.role === 'bot';

  // Basic markdown rendering for lists and bold text
  const formatText = (text) => {
    if (!text) return null;
    
    // Split by newlines
    const lines = text.split('\n');
    let inList = false;
    let listItems = [];
    const elements = [];

    lines.forEach((line, index) => {
      // Bold text formatting **text**
      const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        inList = true;
        listItems.push(<li key={index}>{formattedLine.slice(1)}</li>); // Slice to remove the bullet point string if we parsed it properly, but here we just render formattedLine inside li
      } else {
        if (inList) {
          elements.push(<ul key={`ul-${index}`}>{listItems}</ul>);
          inList = false;
          listItems = [];
        }
        if (line.trim() !== '') {
          elements.push(<p key={index}>{formattedLine}</p>);
        }
      }
    });

    if (inList) {
      elements.push(<ul key="ul-end">{listItems}</ul>);
    }

    return elements;
  };

  return (
    <div className={`chat-message-wrapper ${isBot ? 'bot' : 'user'}`}>
      <div className={`avatar ${isBot ? 'bot' : 'user'}`}>
        {isBot ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className={`message-bubble ${isBot ? 'bot' : 'user'}`}>
        {isBot ? formatText(message.content) : <p style={{ margin: 0 }}>{message.content}</p>}
      </div>
    </div>
  );
}
