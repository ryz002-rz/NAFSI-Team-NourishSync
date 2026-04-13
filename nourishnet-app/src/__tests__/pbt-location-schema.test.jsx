// Feature: foundation-setup, Property 3: LocationEntry schema conformance and null-safety
// **Validates: Requirements 2.4, 2.6**

import React from 'react';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import LocationCard from '../components/shared/LocationCard';

/**
 * Arbitrary for a LocationEntry object matching the ACTUAL schema
 * from locations_sample.json. Optional fields may be null or empty.
 */
const locationEntryArb = fc.record({
  // Required fields
  id: fc.string({ minLength: 1, maxLength: 20 }),
  name: fc.string({ minLength: 1, maxLength: 80 }),
  address: fc.record({
    street: fc.string({ minLength: 1, maxLength: 100 }),
    city: fc.string({ minLength: 1, maxLength: 50 }),
    state: fc.stringOf(fc.constantFrom('M', 'D', 'V', 'A', 'C'), { minLength: 2, maxLength: 2 }),
    zip: fc.stringMatching(/^\d{5}$/),
  }),
  lat: fc.double({ min: -90, max: 90, noNaN: true }),
  lng: fc.double({ min: -180, max: 180, noNaN: true }),

  // Optional string fields — can be null or empty string
  hours: fc.oneof(fc.constant(null), fc.constant(''), fc.string({ maxLength: 100 })),
  phone: fc.oneof(fc.constant(null), fc.constant(''), fc.string({ maxLength: 30 })),
  website: fc.oneof(fc.constant(null), fc.constant(''), fc.string({ maxLength: 200 })),

  // Optional array fields — can be empty
  requirements: fc.oneof(fc.constant([]), fc.array(fc.string({ maxLength: 50 }), { maxLength: 5 })),
  foodTypes: fc.oneof(fc.constant([]), fc.array(fc.string({ maxLength: 30 }), { maxLength: 8 })),
  tags: fc.oneof(fc.constant([]), fc.array(fc.string({ maxLength: 30 }), { maxLength: 6 })),

  // healthAttributes object with boolean fields
  healthAttributes: fc.record({
    halal: fc.boolean(),
    vegan: fc.boolean(),
    vegetarian: fc.boolean(),
    noBeef: fc.boolean(),
    lowGI: fc.boolean(),
    freshProduce: fc.boolean(),
    dairyFree: fc.boolean(),
  }),

  // Other fields
  insecurityIndex: fc.integer({ min: 1, max: 5 }),
  type: fc.constantFrom('customer', 'donor', 'volunteer'),
  lastVerified: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
    .map((d) => d.toISOString().slice(0, 10)),
  source: fc.record({
    source_name: fc.string({ maxLength: 80 }),
    source_url: fc.string({ maxLength: 200 }),
    extracted_from: fc.string({ maxLength: 200 }),
  }),
});

describe('Property 3: LocationEntry schema conformance and null-safety', () => {
  it('all required fields are present with correct types for any generated LocationEntry', () => {
    fc.assert(
      fc.property(locationEntryArb, (entry) => {
        // Required fields exist and have correct types
        expect(typeof entry.id).toBe('string');
        expect(entry.id.length).toBeGreaterThan(0);

        expect(typeof entry.name).toBe('string');
        expect(entry.name.length).toBeGreaterThan(0);

        // address is an object with required sub-fields
        expect(entry.address).toBeDefined();
        expect(typeof entry.address).toBe('object');
        expect(typeof entry.address.street).toBe('string');
        expect(typeof entry.address.city).toBe('string');
        expect(typeof entry.address.state).toBe('string');
        expect(typeof entry.address.zip).toBe('string');

        expect(typeof entry.lat).toBe('number');
        expect(typeof entry.lng).toBe('number');
        expect(Number.isFinite(entry.lat)).toBe(true);
        expect(Number.isFinite(entry.lng)).toBe(true);

        // Optional fields are either null, string, or array as appropriate
        expect(entry.hours === null || typeof entry.hours === 'string').toBe(true);
        expect(entry.phone === null || typeof entry.phone === 'string').toBe(true);
        expect(entry.website === null || typeof entry.website === 'string').toBe(true);
        expect(Array.isArray(entry.requirements)).toBe(true);
        expect(Array.isArray(entry.foodTypes)).toBe(true);
        expect(Array.isArray(entry.tags)).toBe(true);

        // healthAttributes is an object with boolean fields
        expect(typeof entry.healthAttributes).toBe('object');
        for (const key of ['halal', 'vegan', 'vegetarian', 'noBeef', 'lowGI', 'freshProduce', 'dairyFree']) {
          expect(typeof entry.healthAttributes[key]).toBe('boolean');
        }

        // Other typed fields
        expect(typeof entry.insecurityIndex).toBe('number');
        expect(Number.isFinite(entry.insecurityIndex)).toBe(true);
        expect(typeof entry.type).toBe('string');
        expect(typeof entry.lastVerified).toBe('string');
        expect(typeof entry.source).toBe('object');
      }),
      { numRuns: 100 }
    );
  });

  it('rendering LocationCard with any generated entry (including null optional fields) does not throw', () => {
    fc.assert(
      fc.property(locationEntryArb, (entry) => {
        // This must not throw
        const { unmount } = render(<LocationCard location={entry} />);
        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
