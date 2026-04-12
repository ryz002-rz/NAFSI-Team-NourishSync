import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Impact calculation constants (approximate values for demonstration).
 * Sources: EPA, USDA food waste data.
 */
const LBS_CO2_PER_LB_FOOD = 3.8;
const MEALS_PER_LB = 0.75;
const GALLONS_WATER_PER_LB = 108;

/** Demo community total when real data isn't available */
const DEMO_COMMUNITY_LBS = 12500;

/**
 * ImpactCalculator — lets donors estimate the environmental and community impact
 * of their food donations. Shows CO2 saved, meals provided, and water conserved.
 * Includes community totals and share functionality. Fully i18n-ready.
 *
 * Props:
 *   locations?: Array — donor locations (used to sum totalDonatedLbs if available)
 */
function ImpactCalculator({ locations = [] }) {
  const { t } = useTranslation();
  const [pounds, setPounds] = useState('');
  const [copied, setCopied] = useState(false);

  const lbs = parseFloat(pounds) || 0;
  const co2Saved = (lbs * LBS_CO2_PER_LB_FOOD).toFixed(1);
  const mealsProvided = Math.floor(lbs * MEALS_PER_LB);
  const waterSaved = Math.floor(lbs * GALLONS_WATER_PER_LB);

  // Community total: sum totalDonatedLbs from locations, fallback to demo value
  const communityLbs = useMemo(() => {
    const sum = locations.reduce((acc, loc) => acc + (loc.totalDonatedLbs || 0), 0);
    return sum > 0 ? sum : DEMO_COMMUNITY_LBS;
  }, [locations]);

  const commCo2 = (communityLbs * LBS_CO2_PER_LB_FOOD).toFixed(0);
  const commMeals = Math.floor(communityLbs * MEALS_PER_LB);

  const stats = [
    { label: t('impact.co2'), value: `${co2Saved} lbs`, emoji: '🌍', color: 'text-primary-600' },
    { label: t('impact.meals'), value: mealsProvided, emoji: '🍽️', color: 'text-warm-600' },
    { label: t('impact.water'), value: `${waterSaved} gal`, emoji: '💧', color: 'text-blue-600' },
  ];

  const handleShare = async () => {
    const text = `I donated ${lbs} lbs of food, saving ${co2Saved} lbs of CO₂ and providing ${mealsProvided} meals! 🌱 #NourishNet`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6">
      <h3 className="text-lg font-bold text-neutral-800 mb-1">
        🌱 {t('impact.title')}
      </h3>
      <p className="text-sm text-neutral-500 mb-4">
        {t('impact.description')}
      </p>

      <div className="flex items-center gap-3 mb-6">
        <label htmlFor="impact-lbs" className="text-sm font-medium text-neutral-700 whitespace-nowrap">
          {t('impact.inputLabel')}
        </label>
        <input
          id="impact-lbs"
          type="number"
          min="0"
          step="1"
          value={pounds}
          onChange={(e) => setPounds(e.target.value)}
          placeholder={t('impact.inputPlaceholder')}
          className="flex-1 px-3 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {/* Personal impact stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center p-4 bg-neutral-50 rounded-xl">
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {lbs > 0 ? stat.value : '—'}
            </div>
            <div className="text-xs text-neutral-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Share button */}
      {lbs > 0 && (
        <button
          onClick={handleShare}
          className="w-full mb-6 py-2 px-4 text-sm font-medium rounded-xl border border-primary-200 text-primary-600 hover:bg-primary-50 transition-colors"
        >
          {copied ? '✅ Copied!' : '📋 ' + t('impact.share')}
        </button>
      )}

      {/* Community total */}
      <div className="border-t border-neutral-100 pt-4">
        <h4 className="text-sm font-semibold text-neutral-700 mb-3">
          🏘️ {t('impact.communityTitle')}
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-primary-600">{communityLbs.toLocaleString()} lbs</div>
            <div className="text-[11px] text-neutral-400">{t('impact.communityDonated')}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warm-600">{commMeals.toLocaleString()}</div>
            <div className="text-[11px] text-neutral-400">{t('impact.meals')}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{commCo2.toLocaleString()} lbs</div>
            <div className="text-[11px] text-neutral-400">{t('impact.co2')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImpactCalculator;
