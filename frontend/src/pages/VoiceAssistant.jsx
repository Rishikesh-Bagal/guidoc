import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, VolumeX, Square, RotateCcw } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import './VoiceAssistant.css';

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [language, setLanguage] = useState('en-IN');
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am your AI Voice Assistant. How can I help you today?' }
  ]);
  const [statusText, setStatusText] = useState('Tap the microphone to speak');
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const historyContainerRef = useRef(null);
  
  // Track true state to avoid race conditions
  const isRecognizingRef = useRef(false);
  const userStoppedRef = useRef(true); // default true so it doesn't auto-start
  const silenceTimeoutRef = useRef(null);

  // Check browser compatibility on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setStatusText('Speech recognition is not supported in this browser.');
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // We manage restarts manually for better control
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setIsListening(true);
      setStatusText('Listening...');
      
      // Clear any previous timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      // Configured timeout for user stopping speech (e.g., 10 seconds of silence = stop listening)
      // This fulfills "User stops speaking for the configured timeout"
      silenceTimeoutRef.current = setTimeout(() => {
        if (isRecognizingRef.current) {
          console.log('Timeout: No speech detected for 10 seconds. Stopping.');
          userStoppedRef.current = true;
          recognition.stop();
        }
      }, 10000);
    };

    recognition.onresult = (event) => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      const transcript = event.results[0][0].transcript;
      
      // Stop listening to process speech and prevent self-listening to TTS
      userStoppedRef.current = true;
      recognition.stop();
      
      handleUserSpeech(transcript);
    };

    recognition.onerror = (event) => {
      console.error(`Speech recognition error: ${event.error}`);
      
      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          console.error('Error logging: permission denied.');
          userStoppedRef.current = true;
          setStatusText('Microphone access denied.');
          setIsListening(false);
          break;
        case 'no-speech':
          console.log('Error logging: no speech detected.');
          // Don't auto-stop on no-speech unless timeout triggered
          break;
        case 'aborted':
          console.log('Error logging: aborted.');
          break;
        case 'network':
          console.warn('Error logging: network error. Will retry if appropriate.');
          // Transient error, don't set userStoppedRef to true, let onend restart it
          break;
        case 'audio-capture':
          console.error('Error logging: audio capture error.');
          userStoppedRef.current = true;
          setStatusText('No microphone found.');
          setIsListening(false);
          break;
        default:
          console.error('Error logging: unknown error -', event.error);
          break;
      }
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setIsListening(false);
      
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      // Retry / Continuous loop logic
      // Never restart if user pressed stop, or permission denied, or thinking/speaking
      if (!userStoppedRef.current && !isThinking && !isSpeaking) {
        try {
          if (!isRecognizingRef.current) {
            recognition.start();
          }
        } catch (e) {
          console.error("Failed to restart recognition onend:", e);
        }
      } else if (!isThinking && userStoppedRef.current) {
        if (statusText === 'Listening...') {
          setStatusText('Tap the microphone to speak');
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      userStoppedRef.current = true;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [language, isThinking, isSpeaking]); // Re-bind when these change so onend closures are fresh

  useEffect(() => {
    // Load initial history
    const loadHistory = async () => {
      if (currentUser) {
        const history = await userService.getVoiceChatHistory(currentUser.uid);
        if (history && history.length > 0) {
           const formattedHistory = history.reverse().flatMap(h => [
             { role: 'user', content: h.query },
             { role: 'bot', content: h.response }
           ]);
           if (formattedHistory.length > 0) {
             setMessages([{ role: 'bot', content: 'History loaded.' }, ...formattedHistory]);
           }
        }
      }
    };
    loadHistory();

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [currentUser]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTop = historyContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const speak = useCallback((text) => {
    if (!synthRef.current || isMuted) return;
    
    // Properly stop SpeechSynthesis before starting a new utterance
    synthRef.current.cancel(); 
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = synthRef.current.getVoices();
    const targetLang = language.substring(0, 2);
    const voice = voices.find(v => v.lang.startsWith(targetLang));
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      // Prevent SpeechRecognition and SpeechSynthesis from interrupting each other
      if (isRecognizingRef.current && recognitionRef.current) {
         recognitionRef.current.abort();
      }
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      // Restart listening if it was listening before (we can check a state if we wanted to auto-resume, 
      // but usually we wait for user to click again or use a wake word. For now, we leave it stopped).
      setStatusText('Tap the microphone to speak');
    };
    
    utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        setIsSpeaking(false);
        setStatusText('Tap the microphone to speak');
    };

    synthRef.current.speak(utterance);
  }, [language, isMuted]);

  const handleVoiceCommand = (transcript) => {
    const lower = transcript.toLowerCase();
    let handled = false;
    
    if (lower.includes('go home') || lower.includes('home page')) {
      speak('Going to home page');
      setTimeout(() => navigate('/'), 1500);
      handled = true;
    } else if (lower.includes('open dashboard') || lower.includes('go to dashboard')) {
      speak('Opening dashboard');
      setTimeout(() => navigate('/dashboard'), 1500);
      handled = true;
    } else if (lower.includes('open profile') || lower.includes('go to profile')) {
      speak('Opening your profile');
      setTimeout(() => navigate('/profile'), 1500);
      handled = true;
    } else if (lower.includes('open tracker') || lower.includes('application tracker')) {
      speak('Opening application tracker');
      setTimeout(() => navigate('/tracker'), 1500);
      handled = true;
    } else if (lower.includes('open document') || lower.includes('open scanner')) {
      speak('Opening scanner');
      setTimeout(() => navigate('/scanner'), 1500);
      handled = true;
    } else if (lower.includes('search')) {
      const searchItem = lower.replace('search', '').trim();
      speak(`Searching for ${searchItem}`);
      setTimeout(() => navigate(`/search?q=${encodeURIComponent(searchItem)}`), 1500);
      handled = true;
    } else if (lower.includes('start eligibility check') || lower.includes('check eligibility')) {
      speak('Starting eligibility check');
      setTimeout(() => navigate('/eligibility'), 1500);
      handled = true;
    }
    
    return handled;
  };

  const handleUserSpeech = async (transcript) => {
    setStatusText('Processing...');
    const userMsg = { role: 'user', content: transcript };
    setMessages(prev => [...prev, userMsg]);
    
    if (handleVoiceCommand(transcript)) {
      setStatusText('Tap the microphone to speak');
      return;
    }

    setIsThinking(true);
    
    // Properly stop SpeechSynthesis before AI response
    if (synthRef.current) {
        synthRef.current.cancel();
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/ai/chat', {
        message: transcript
      });
      
      const aiReply = response.data.reply;
      const botMsg = { role: 'bot', content: aiReply };
      setMessages(prev => [...prev, botMsg]);
      
      speak(aiReply);

      if (currentUser) {
        userService.saveVoiceChatMessage(currentUser.uid, transcript, aiReply, language);
      }
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMsg = 'Sorry, I am having trouble connecting to the server.';
      setMessages(prev => [...prev, { role: 'bot', content: errorMsg }]);
      speak(errorMsg);
    } finally {
      setIsThinking(false);
      // Let speech synthesis onend handle the status text if it's speaking
      if (!synthRef.current.speaking) {
         setStatusText('Tap the microphone to speak');
      }
    }
  };

  const toggleListen = () => {
    if (!isSupported) return;

    if (isListening) {
      userStoppedRef.current = true;
      recognitionRef.current?.stop();
    } else {
      userStoppedRef.current = false;
      if (synthRef.current) synthRef.current.cancel();
      
      // Never call recognition.start() while recognition is already running
      if (recognitionRef.current && !isRecognizingRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error("Failed to start recognition:", e);
            setStatusText('Failed to start microphone. Please try again.');
          }
      }
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const replayLastResponse = () => {
    const lastBotMsg = [...messages].reverse().find(m => m.role === 'bot');
    if (lastBotMsg) {
      speak(lastBotMsg.content);
    }
  };

  return (
    <div className="voice-assistant-page">
      <div className="voice-container">
        
        <div className="voice-header">
          <h1>
            <Mic size={28} />
            Voice Assistant
          </h1>
          <div className="voice-controls">
            <select 
              className="lang-select" 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isListening || isThinking}
            >
              <option value="en-IN">English</option>
              <option value="hi-IN">Hindi (हिंदी)</option>
            </select>
            <button 
              className="action-btn"
              onClick={() => {
                setIsMuted(!isMuted);
                if (!isMuted) stopSpeaking();
              }}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>
        </div>

        <div className="chat-history-container" ref={historyContainerRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`voice-message ${msg.role}`}>
              <div className="message-bubble">{msg.content}</div>
              {msg.role === 'bot' && idx === messages.length - 1 && !isThinking && (
                <div className="voice-message-actions">
                  <button className="action-btn" onClick={replayLastResponse} title="Replay">
                    <RotateCcw size={16} /> Replay
                  </button>
                  {isSpeaking && (
                    <button className="action-btn" onClick={stopSpeaking} title="Stop Speaking">
                      <Square size={16} /> Stop
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="voice-message bot">
              <div className="message-bubble">
                <div className="thinking-anim">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="interaction-area">
          <div className="status-text">{statusText}</div>
          
          <div className="mic-wrapper">
            <button 
              className={`mic-btn ${isListening ? 'listening' : ''} ${!isSupported ? 'disabled' : ''}`}
              onClick={toggleListen}
              disabled={!isSupported}
              aria-label={isListening ? "Stop listening" : "Start listening"}
              style={{ opacity: isSupported ? 1 : 0.5, cursor: isSupported ? 'pointer' : 'not-allowed' }}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </button>
            {isListening && (
              <>
                <div className="waves"></div>
                <div className="waves"></div>
                <div className="waves"></div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VoiceAssistant;
