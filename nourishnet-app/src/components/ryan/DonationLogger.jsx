import { useState, useRef } from 'react';

const FOOD_CATEGORIES = [
  'Canned Goods', 'Fresh Produce', 'Dairy', 'Bread',
  'Frozen Meat', 'Baby Formula', 'Hygiene Items', 'Grains',
  'Shelf-Stable Items', 'Groceries',
];

const DELIVERY_OPTIONS = [
  { key: 'dropoff', label: '🚗 I\'ll drop it off', desc: 'Bring your donation to the location during drop-off hours' },
  { key: 'pickup', label: '📦 Request pickup', desc: 'A volunteer or the pantry will come to collect your donation' },
  { key: 'ship', label: '📬 Ship it', desc: 'Mail your donation to the location\'s address' },
];

const TIME_SLOTS = ['Morning (8am–12pm)', 'Afternoon (12pm–4pm)', 'Evening (4pm–7pm)'];

const LBS_CO2_PER_LB = 3.8;
const MEALS_PER_LB = 0.75;
const GALLONS_WATER_PER_LB = 108;

function DonationLogger({ locationName }) {
  const [step, setStep] = useState(1); // 1=what, 2=how, 3=when, 4=confirm, 5=done
  const [inputMode, setInputMode] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [manualItems, setManualItems] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [weight, setWeight] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const lbs = parseFloat(weight) || 0;
  const co2Saved = (lbs * LBS_CO2_PER_LB).toFixed(1);
  const mealsProvided = Math.floor(lbs * MEALS_PER_LB);
  const waterSaved = Math.floor(lbs * GALLONS_WATER_PER_LB);

  const handleCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = () => {
    const entry = {
      photo, categories: selectedCategories, manualItems, weight: lbs,
      delivery, date, timeSlot, pickupAddress, notes,
      location: locationName || null, date_created: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('nourishnet_donations') || '[]');
    existing.push(entry);
    localStorage.setItem('nourishnet_donations', JSON.stringify(existing));
    setStep(5);
  };

  const handleReset = () => {
    setStep(1); setInputMode(null); setPhoto(null); setManualItems('');
    setSelectedCategories([]); setWeight(''); setDelivery(null);
    setDate(''); setTimeSlot(''); setPickupAddress(''); setNotes('');
  };

  const handleShare = async () => {
    const text = `I donated ${lbs} lbs of food${locationName ? ` to ${locationName}` : ''}, saving ${co2Saved} lbs of CO₂ and providing ${mealsProvided} meals! 🌱 #NourishNet`;
    try { await navigator.clipboard.writeText(text); } catch { /* fallback */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canProceedStep1 = (selectedCategories.length > 0 || manualItems.trim()) && lbs > 0;
  const canProceedStep2 = delivery !== null;
  const canProceedStep3 = date && timeSlot && (delivery !== 'pickup' || pickupAddress.trim());

  const stepLabels = ['What', 'How', 'When', 'Review'];

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-5">
      <h3 className="text-lg font-bold text-warm-700 mb-1">📸 Log Your Donation</h3>
      <p className="text-sm text-neutral-500 mb-3">
        {locationName ? `Donating to ${locationName}` : 'Log what you\'re donating and see your impact.'}
      </p>

      {/* Step indicator */}
      {step <= 4 && (
        <div className="flex items-center gap-1 mb-4">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full ${i + 1 <= step ? 'bg-warm-500' : 'bg-neutral-200'}`} />
              <p className={`text-[10px] mt-1 text-center ${i + 1 === step ? 'text-warm-600 font-semibold' : 'text-neutral-400'}`}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: What are you donating? */}
      {step === 1 && (
        <div className="space-y-4">
          {!inputMode && (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setInputMode('camera')} className="py-5 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-500 hover:border-warm-400 hover:text-warm-600 transition-colors">
                <div className="text-2xl mb-1">📷</div>
                <div className="text-xs font-medium">Take a Photo</div>
              </button>
              <button onClick={() => setInputMode('manual')} className="py-5 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-500 hover:border-warm-400 hover:text-warm-600 transition-colors">
                <div className="text-2xl mb-1">✏️</div>
                <div className="text-xs font-medium">Type Items</div>
              </button>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleCapture} className="hidden" />
          {inputMode === 'camera' && (
            photo ? (
              <div className="relative">
                <img src={photo} alt="Preview" className="w-full h-36 object-cover rounded-xl" />
                <button onClick={() => setPhoto(null)} className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-neutral-500 shadow text-sm">✕</button>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-5 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-400 hover:border-warm-400 hover:text-warm-600 transition-colors">
                📷 Tap to photograph
              </button>
            )
          )}

          {inputMode === 'manual' && (
            <textarea value={manualItems} onChange={(e) => setManualItems(e.target.value)} placeholder="e.g. 2 bags of rice, 5 cans of beans..." rows={2} className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-100 resize-none" />
          )}

          {inputMode && <button onClick={() => setInputMode(null)} className="text-xs text-neutral-400 hover:text-neutral-600">← Switch method</button>}

          <div>
            <p className="text-sm font-medium text-neutral-600 mb-2">Food categories</p>
            <div className="flex flex-wrap gap-1.5">
              {FOOD_CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => toggleCategory(cat)} className={`px-2.5 py-1 text-xs rounded-full transition-colors ${selectedCategories.includes(cat) ? 'bg-warm-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{cat}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-600 block mb-1">Weight (lbs)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 25" min="0" className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-100" />
          </div>

          {lbs > 0 && (
            <div className="flex gap-2 text-center text-xs text-neutral-500">
              <div className="flex-1 p-2 bg-neutral-50 rounded-lg">🌍 <span className="font-semibold text-primary-600">{co2Saved}</span> lbs CO₂</div>
              <div className="flex-1 p-2 bg-neutral-50 rounded-lg">🍽️ <span className="font-semibold text-warm-600">{mealsProvided}</span> meals</div>
              <div className="flex-1 p-2 bg-neutral-50 rounded-lg">💧 <span className="font-semibold text-blue-600">{waterSaved}</span> gal</div>
            </div>
          )}

          <button onClick={() => setStep(2)} disabled={!canProceedStep1} className="w-full py-2.5 text-sm font-semibold rounded-xl bg-warm-500 text-white hover:bg-warm-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Next: How to deliver →
          </button>
        </div>
      )}

      {/* STEP 2: How will it be delivered? */}
      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-neutral-700">How will you deliver your donation?</p>
          {DELIVERY_OPTIONS.map((opt) => (
            <button key={opt.key} onClick={() => setDelivery(opt.key)} className={`w-full text-left p-3 rounded-xl border-2 transition-colors ${delivery === opt.key ? 'border-warm-500 bg-warm-50' : 'border-neutral-200 hover:border-neutral-300'}`}>
              <div className="text-sm font-semibold text-neutral-800">{opt.label}</div>
              <div className="text-xs text-neutral-500 mt-0.5">{opt.desc}</div>
            </button>
          ))}

          {delivery === 'pickup' && (
            <div>
              <label className="text-sm font-medium text-neutral-600 block mb-1">Your pickup address</label>
              <input type="text" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder="e.g. 123 Main St, Hyattsville, MD" className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-100" />
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">← Back</button>
            <button onClick={() => setStep(3)} disabled={!canProceedStep2} className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-warm-500 text-white hover:bg-warm-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next: When →</button>
          </div>
        </div>
      )}

      {/* STEP 3: When? */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-neutral-700">
            {delivery === 'dropoff' ? 'When will you drop it off?' : delivery === 'pickup' ? 'When should we pick it up?' : 'When will you ship it?'}
          </p>

          <div>
            <label className="text-sm font-medium text-neutral-600 block mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-100" />
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-600 mb-2">Preferred time</p>
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map((slot) => (
                <button key={slot} onClick={() => setTimeSlot(slot)} className={`px-3 py-1.5 text-xs rounded-full transition-colors ${timeSlot === slot ? 'bg-warm-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{slot}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-600 block mb-1">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Ring doorbell, leave at front desk..." rows={2} className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-100 resize-none" />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">← Back</button>
            <button onClick={() => setStep(4)} disabled={!canProceedStep3} className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-warm-500 text-white hover:bg-warm-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Review →</button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Confirm */}
      {step === 4 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-neutral-700">Review your donation</p>

          <div className="bg-neutral-50 rounded-xl p-3 space-y-2 text-sm">
            {locationName && <div><span className="text-neutral-500">To:</span> <span className="font-medium">{locationName}</span></div>}
            <div><span className="text-neutral-500">Items:</span> <span className="font-medium">{selectedCategories.join(', ')}{manualItems ? ` — ${manualItems}` : ''}</span></div>
            <div><span className="text-neutral-500">Weight:</span> <span className="font-medium">{lbs} lbs</span></div>
            <div><span className="text-neutral-500">Delivery:</span> <span className="font-medium">{DELIVERY_OPTIONS.find(o => o.key === delivery)?.label}</span></div>
            {delivery === 'pickup' && <div><span className="text-neutral-500">Pickup from:</span> <span className="font-medium">{pickupAddress}</span></div>}
            <div><span className="text-neutral-500">Date:</span> <span className="font-medium">{date}</span></div>
            <div><span className="text-neutral-500">Time:</span> <span className="font-medium">{timeSlot}</span></div>
            {notes && <div><span className="text-neutral-500">Notes:</span> <span className="font-medium">{notes}</span></div>}
          </div>

          <div className="flex gap-2 text-center text-xs text-neutral-500">
            <div className="flex-1 p-2 bg-neutral-50 rounded-lg">🌍 <span className="font-semibold text-primary-600">{co2Saved}</span> lbs CO₂</div>
            <div className="flex-1 p-2 bg-neutral-50 rounded-lg">🍽️ <span className="font-semibold text-warm-600">{mealsProvided}</span> meals</div>
            <div className="flex-1 p-2 bg-neutral-50 rounded-lg">💧 <span className="font-semibold text-blue-600">{waterSaved}</span> gal</div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(3)} className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">← Back</button>
            <button onClick={handleSubmit} className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-warm-500 text-white hover:bg-warm-600 transition-colors">✅ Confirm Donation</button>
          </div>
        </div>
      )}

      {/* STEP 5: Success */}
      {step === 5 && (
        <div className="space-y-4 text-center">
          <div className="py-2">
            <span className="text-4xl">🎉</span>
            <p className="text-primary-700 font-bold text-lg mt-2">Donation confirmed!</p>
            <p className="text-neutral-500 text-sm mt-1">
              {delivery === 'dropoff' && `Drop off ${lbs} lbs on ${date} (${timeSlot})`}
              {delivery === 'pickup' && `Pickup scheduled for ${date} (${timeSlot})`}
              {delivery === 'ship' && `Ship by ${date}`}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-neutral-50 rounded-xl">
              <div className="text-xl">🌍</div>
              <div className="text-xl font-bold text-primary-600">{co2Saved}</div>
              <div className="text-[11px] text-neutral-400">lbs CO₂ saved</div>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-xl">
              <div className="text-xl">🍽️</div>
              <div className="text-xl font-bold text-warm-600">{mealsProvided}</div>
              <div className="text-[11px] text-neutral-400">meals provided</div>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-xl">
              <div className="text-xl">💧</div>
              <div className="text-xl font-bold text-blue-600">{waterSaved}</div>
              <div className="text-[11px] text-neutral-400">gal water saved</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleShare} className="flex-1 py-2 text-sm font-medium rounded-xl border border-primary-200 text-primary-600 hover:bg-primary-50 transition-colors">
              {copied ? '✅ Copied!' : '📋 Share Impact'}
            </button>
            <button onClick={handleReset} className="flex-1 py-2 text-sm font-medium rounded-xl bg-warm-500 text-white hover:bg-warm-600 transition-colors">
              Log Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonationLogger;
