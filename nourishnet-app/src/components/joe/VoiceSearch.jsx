import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Voice keyword → dietary filter mapping (English).
 */
const VOICE_KEYWORD_MAP_EN = {
  halal: 'halal',
  vegan: 'vegan',
  vegetarian: 'vegetarian',
  'no beef': 'noBeef',
  beef: 'noBeef',
  'low gi': 'lowGI',
  'low glycemic': 'lowGI',
  diabetic: 'lowGI',
  'fresh produce': 'freshProduce',
  fresh: 'freshProduce',
  vegetables: 'freshProduce',
  fruits: 'freshProduce',
  produce: 'freshProduce',
  'dairy free': 'dairyFree',
  'no dairy': 'dairyFree',
  'lactose free': 'dairyFree',
};

/**
 * Voice keyword → dietary filter mapping (Spanish).
 */
const VOICE_KEYWORD_MAP_ES = {
  halal: 'halal',
  vegano: 'vegan',
  vegana: 'vegan',
  vegetariano: 'vegetarian',
  vegetariana: 'vegetarian',
  'sin carne': 'noBeef',
  'sin carne de res': 'noBeef',
  'bajo índice glucémico': 'lowGI',
  'bajo gi': 'lowGI',
  diabético: 'lowGI',
  'productos frescos': 'freshProduce',
  'frutas frescas': 'freshProduce',
  'verduras frescas': 'freshProduce',
  verduras: 'freshProduce',
  frutas: 'freshProduce',
  'sin lácteos': 'dairyFree',
  'sin leche': 'dairyFree',
  'libre de lácteos': 'dairyFree',
};

/**
 * i18n language code → BCP-47 recognition language mapping.
 */
const LANG_MAP = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  zh: 'zh-CN',
  am: 'am-ET',
  tl: 'tl-PH',
};

/**
 * Get the keyword map for the given i18n language code.
 */
function getKeywordMap(langCode) {
  if (langCode === 'es') return VOICE_KEYWORD_MAP_ES;
  return VOICE_KEYWORD_MAP_EN;
}

/**
 * Check if the Web Speech API is available in this browser.
 */
export function isSpeechSupported() {
  return !!(
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
  );
}

/**
 * Parse transcript text and return matching dietary filter keys + remaining search text.
 * @param {string} transcript
 * @param {string} langCode - i18n language code (e.g. 'en', 'es')
 * @returns {{ filters: string[], searchText: string }}
 */
export function parseVoiceInput(transcript, langCode = 'en') {
  const lower = transcript.toLowerCase().trim();
  const matchedFilters = [];
  let remaining = lower;

  const keywordMap = getKeywordMap(langCode);
  const sortedKeywords = Object.keys(keywordMap).sort(
    (a, b) => b.length - a.length
  );

  for (const keyword of sortedKeywords) {
    if (remaining.includes(keyword)) {
      const filterKey = keywordMap[keyword];
      if (!matchedFilters.includes(filterKey)) {
        matchedFilters.push(filterKey);
      }
      remaining = remaining.replace(keyword, '').trim();
    }
  }

  return { filters: matchedFilters, searchText: remaining };
}


/**
 * VoiceSearch — microphone button that uses Web Speech API to capture voice input,
 * maps keywords to dietary filters, and passes remaining text as search query.
 * Detects current i18n language for recognition and keyword matching.
 * Shows transcript feedback and activated filters after recognition.
 *
 * Props:
 *   onResult: ({ filters: string[], searchText: string }) => void
 */
function VoiceSearch({ onResult }) {
  const { i18n, t } = useTranslation();
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null); // { transcript, filters }
  const recognitionRef = useRef(null);
  const retryRef = useRef(false);
  const feedbackTimerRef = useRef(null);

  // Clear feedback timer on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const showFeedback = useCallback((transcript, filters) => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    setFeedback({ transcript, filters });
    feedbackTimerRef.current = setTimeout(() => setFeedback(null), 3000);
  }, []);

  const startListening = useCallback(() => {
    if (!isSpeechSupported()) {
      setError('Voice search is not supported in this browser');
      return;
    }

    setError(null);
    setFeedback(null);
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Set recognition language based on current i18n language
    const currentLang = i18n.language || 'en';
    recognition.lang = LANG_MAP[currentLang] || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const parsed = parseVoiceInput(transcript, currentLang);
      onResult(parsed);
      showFeedback(transcript, parsed.filters);
      setListening(false);
      retryRef.current = false;
    };

    recognition.onerror = (event) => {
      // Auto-retry once on no-speech
      if (event.error === 'no-speech' && !retryRef.current) {
        retryRef.current = true;
        setTimeout(() => {
          try { recognition.start(); } catch { /* ignore */ }
        }, 500);
        return;
      }

      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permissions in your browser settings.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Try again.');
      } else {
        setError(`Error: ${event.error}`);
      }
      setListening(false);
      retryRef.current = false;
    };

    recognition.onend = () => {
      if (!retryRef.current) {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;
    retryRef.current = false;
    recognition.start();
    setListening(true);
  }, [i18n.language, onResult, showFeedback]);

  const stopListening = useCallback(() => {
    retryRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  }, []);

  if (!isSpeechSupported()) return null;

  const FILTER_LABELS = {
    halal: 'Halal', vegan: 'Vegan', vegetarian: 'Vegetarian',
    noBeef: 'No Beef', lowGI: 'Low GI', freshProduce: 'Fresh Produce',
    dairyFree: 'Dairy Free',
  };

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <button
        onClick={listening ? stopListening : startListening}
        className={`p-2.5 rounded-full transition-all duration-200 ${
          listening
            ? 'bg-danger text-white animate-pulse shadow-hover'
            : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
        }`}
        aria-label={listening ? 'Stop voice search' : t('common.search') + ' by voice'}
        title={listening ? 'Listening...' : 'Voice search'}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {listening ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10l6 6m0-6l-6 6" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M12 15a3 3 0 003-3V5a3 3 0 00-6 0v7a3 3 0 003 3z" />
          )}
        </svg>
      </button>
      {listening && (
        <span className="text-xs text-danger font-medium animate-pulse">
          Listening...
        </span>
      )}
      {error && (
        <span className="text-xs text-danger max-w-[200px] text-center">{error}</span>
      )}
      {feedback && (
        <div className="text-xs text-center max-w-[220px] mt-1 space-y-0.5">
          <p className="text-neutral-500 italic">"{feedback.transcript}"</p>
          {feedback.filters.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {feedback.filters.map((f) => (
                <span key={f} className="px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded text-[10px] font-medium">
                  {FILTER_LABELS[f] || f}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VoiceSearch;
