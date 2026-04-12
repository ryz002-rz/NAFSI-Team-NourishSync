/**
 * Search Utilities
 * 
 * Pipeline Role: Process search queries and filter location data
 * Flow: Search text → keyword extraction → filter locations → return matches
 */

// Keyword mappings for voice/text search to dietary filters
const KEYWORD_MAPPINGS = {
  // English keywords
  'halal': ['halal'],
  'vegan': ['vegan', 'plant-based', 'plant based'],
  'vegetarian': ['vegetarian', 'veggie', 'no meat'],
  'dairy-free': ['dairy-free', 'dairy free', 'no dairy', 'lactose free'],
  'gluten-free': ['gluten-free', 'gluten free', 'no gluten', 'celiac'],
  'kosher': ['kosher'],
  'low-gi': ['low-gi', 'low gi', 'diabetic', 'diabetes friendly'],
  'fresh': ['fresh', 'produce', 'vegetables', 'fruits'],
  
  // Spanish keywords
  'halal_es': ['halal'],
  'vegan_es': ['vegano', 'vegana', 'a base de plantas'],
  'vegetarian_es': ['vegetariano', 'vegetariana', 'sin carne'],
  'dairy-free_es': ['sin lácteos', 'sin lactosa'],
  'gluten-free_es': ['sin gluten', 'celíaco'],
  'fresh_es': ['fresco', 'fresca', 'verduras', 'frutas', 'productos frescos'],
};

/**
 * Extract dietary tags from search text
 * @param {string} searchText - User's search query
 * @returns {string[]} - Array of matched dietary tags
 */
export function extractDietaryTags(searchText) {
  const lowerText = searchText.toLowerCase();
  const matchedTags = [];

  Object.entries(KEYWORD_MAPPINGS).forEach(([tag, keywords]) => {
    const baseTag = tag.replace('_es', ''); // Remove language suffix
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      if (!matchedTags.includes(baseTag)) {
        matchedTags.push(baseTag);
      }
    }
  });

  return matchedTags;
}

/**
 * Search locations by text query
 * @param {Array} locations - Array of location objects
 * @param {string} searchText - User's search query
 * @returns {Array} - Filtered locations matching the query
 */
export function searchLocations(locations, searchText) {
  if (!searchText || !searchText.trim()) {
    return locations;
  }

  const lowerQuery = searchText.toLowerCase().trim();
  const dietaryTags = extractDietaryTags(searchText);

  return locations.filter(location => {
    // Check name match
    const nameMatch = location.name?.toLowerCase().includes(lowerQuery);
    
    // Check address match
    const addressMatch = location.address?.toLowerCase().includes(lowerQuery);
    
    // Check city match
    const cityMatch = location.city?.toLowerCase().includes(lowerQuery);
    
    // Check description match
    const descMatch = location.description?.toLowerCase().includes(lowerQuery);
    
    // Check dietary tags match
    const dietaryMatch = dietaryTags.length > 0 && 
      dietaryTags.some(tag => 
        location.dietary_tags?.some(locTag => 
          locTag.toLowerCase().includes(tag)
        )
      );
    
    // Check food types match
    const foodTypeMatch = location.food_types?.some(type => 
      lowerQuery.includes(type.toLowerCase()) || 
      type.toLowerCase().includes(lowerQuery)
    );

    return nameMatch || addressMatch || cityMatch || descMatch || dietaryMatch || foodTypeMatch;
  });
}

/**
 * Filter locations by dietary preferences
 * @param {Array} locations - Array of location objects
 * @param {string[]} selectedTags - Array of selected dietary tags
 * @returns {Array} - Filtered locations
 */
export function filterByDietaryTags(locations, selectedTags) {
  if (!selectedTags || selectedTags.length === 0) {
    return locations;
  }

  return locations.filter(location => 
    selectedTags.every(tag => 
      location.dietary_tags?.some(locTag => 
        locTag.toLowerCase().includes(tag.toLowerCase())
      )
    )
  );
}

/**
 * Sort locations by relevance score
 * @param {Array} locations - Array of location objects
 * @param {string} searchText - Original search query
 * @returns {Array} - Sorted locations
 */
export function sortByRelevance(locations, searchText) {
  if (!searchText) return locations;

  const lowerQuery = searchText.toLowerCase();

  return [...locations].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // Name exact match gets highest score
    if (a.name?.toLowerCase().includes(lowerQuery)) scoreA += 10;
    if (b.name?.toLowerCase().includes(lowerQuery)) scoreB += 10;

    // City match
    if (a.city?.toLowerCase().includes(lowerQuery)) scoreA += 5;
    if (b.city?.toLowerCase().includes(lowerQuery)) scoreB += 5;

    // Higher demand level gets priority
    const demandScore = { 'High': 3, 'Medium': 2, 'Low': 1 };
    scoreA += demandScore[a.demand_level] || 0;
    scoreB += demandScore[b.demand_level] || 0;

    return scoreB - scoreA;
  });
}

const searchUtils = {
  extractDietaryTags,
  searchLocations,
  filterByDietaryTags,
  sortByRelevance,
};

export default searchUtils;
