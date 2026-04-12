import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * VoiceSearch Component (STT - Speech-to-Text)
 * 
 * Pipeline Role: Captures voice input → converts to text → triggers search
 * Flow: User speaks → Web Speech API → transcript → onSearch callback → display results
 * 
 * @param {Function} onSearch - Callback when search text is submitted
 * @param {string} placeholder - Placeholder text for input
 */
function VoiceSearch({ onSearch, placeholder }) {
  const { t, i18n } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);

  // Check for Web Speech API support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  // Handle voice recognition
  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    
    // Set language based on current i18n language
    recognition.lang = i18n.language === 'es' ? 'es-ES' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchText(transcript);
      // Auto-trigger search after voice input
      if (onSearch) {
        onSearch(transcript);
      }
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [i18n.language, onSearch]);

  // Handle text input search
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim() && onSearch) {
      onSearch(searchText.trim());
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white rounded-2xl shadow-soft border border-gray-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
          {/* Search Icon */}
          <span className="pl-4 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>

          {/* Text Input */}
          <input
            type="text"
            value={searchText}
            onChange={handleInputChange}
            placeholder={placeholder || t('common.search')}
            className="flex-1 px-4 py-4 bg-transparent outline-none text-gray-900 placeholder-gray-400"
            aria-label="Search"
          />

          {/* Voice Button */}
          {isSupported && (
            <button
              type="button"
              onClick={startListening}
              disabled={isListening}
              className={`
                p-3 mr-2 rounded-xl transition-all duration-200
                ${isListening 
                  ? 'bg-danger text-white animate-pulse' 
                  : 'bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600'
                }
              `}
              aria-label={isListening ? 'Listening...' : 'Start voice search'}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className="btn-primary mr-2 rounded-xl"
            aria-label="Search"
          >
            {t('common.filter')}
          </button>
        </div>
      </form>

      {/* Status Messages */}
      {isListening && (
        <p className="text-center text-primary-600 mt-2 text-sm animate-pulse">
          🎤 Listening... Speak now
        </p>
      )}
      
      {error && (
        <p className="text-center text-danger mt-2 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

export default VoiceSearch;
