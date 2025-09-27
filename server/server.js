const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getActivityRecommendations } = require('./services/claudeService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample dummy data for activities
const sampleActivities = [
  {
    id: 1,
    emoji: "🚋",
    title: "**Muni Heritage Weekend - Sunday 10am-4pm**",
    description: "A special event where families can ride vintage transit vehicles that are rarely seen on San Francisco streets, including vintage buses and the Blackpool Boat Tram. All rides on these special streetcars are FREE all weekend.",
    location: "San Francisco Railway Museum",
    distance: "0.5 miles"
  },
  {
    id: 2,
    emoji: "🇬🇷",
    title: "**Greek Food Festival - Sunday 11am-8pm**",
    description: "The annual Greek Food Festival features delicious traditional food like Spanakopita and Moussaka, plus desserts and Greek wine. Visitors can enjoy classic Greek music, watch award-winning folk dance groups perform, and browse unique gifts from local vendors.",
    location: "Mission District",
    distance: "1.2 miles"
  },
  {
    id: 3,
    emoji: "🎨",
    title: "**Sunday Funnies Exhibit - Sunday 10am-5pm**",
    description: "The Cartoon Art Museum's 40th anniversary showcase features classic comic strips from the dawn of the comics medium to the present day, including works from legendary cartoonists like Charles M. Schulz (Peanuts) and contemporary classics like Phoebe and Her Unicorn.",
    location: "Cartoon Art Museum",
    distance: "2 miles"
  },
  {
    id: 4,
    emoji: "🌳",
    title: "**Lindy in the Park Dance Party - Sunday 11am-2pm**",
    description: "A weekly free swing dance event near the de Young Museum when the streets of Golden Gate Park are closed to traffic. Get ready to swing in Golden Gate Park every sunny Sunday at this family-friendly dance gathering.",
    location: "Golden Gate Park",
    distance: "3.5 miles"
  },
  {
    id: 5,
    emoji: "🦋",
    title: "**Butterfly Garden Workshop - Sunday 2pm-4pm**",
    description: "Learn about local butterfly species and help plant native flowers that attract butterflies to the garden. This hands-on workshop is perfect for families and includes take-home seed packets for creating your own butterfly garden at home.",
    location: "Children's Garden Center",
    distance: "2.8 miles"
  }
];

// Input validation function
const validateSearchInput = ({ city, ages, availability, distance, preferences }) => {
  // List of obviously fake or test city patterns
  const fakeCityPatterns = [
    /^fake/i,           // starts with "fake"
    /test/i,            // contains "test"
    /^dummy/i,          // starts with "dummy"
    /^invalid/i,        // starts with "invalid"
    /^example/i,        // starts with "example"
    /123/,              // contains numbers
    /^[a-z]$/i,         // single letter
    /[!@#$%^&*()]/,     // special characters
    /^\s*$/,            // empty or whitespace only
  ];

  // List of known real cities (basic list - in production you'd use a proper city database)
  const realCities = [
    'austin', 'boston', 'chicago', 'denver', 'seattle', 'portland', 'dallas', 'houston',
    'san francisco', 'los angeles', 'new york', 'miami', 'atlanta', 'philadelphia',
    'phoenix', 'san diego', 'las vegas', 'detroit', 'minneapolis', 'cleveland',
    'tampa', 'orlando', 'charlotte', 'raleigh', 'nashville', 'memphis', 'kansas city',
    'st. louis', 'cincinnati', 'pittsburgh', 'baltimore', 'washington', 'richmond',
    'norfolk', 'jacksonville', 'new orleans', 'baton rouge', 'little rock',
    'oklahoma city', 'tulsa', 'salt lake city', 'albuquerque', 'tucson',
    'sacramento', 'fresno', 'san jose', 'oakland', 'long beach', 'anaheim',
    'santa ana', 'riverside', 'stockton', 'bakersfield', 'fremont', 'san bernardino',
    'modesto', 'fontana', 'oxnard', 'moreno valley', 'huntington beach', 'glendale',
    'santa clarita', 'garden grove', 'oceanside', 'rancho cucamonga', 'ontario',
    'lancaster', 'elk grove', 'corona', 'palmdale', 'salinas', 'pomona', 'torrance',
    'hayward', 'escondido', 'sunnyvale', 'orange', 'fullerton', 'pasadena',
    'thousand oaks', 'visalia', 'simi valley', 'concord', 'roseville'
  ];

  if (!city || typeof city !== 'string') {
    return {
      message: 'City field is required',
      details: 'Please enter a valid city name',
      problemField: 'city',
      suggestions: ['Enter a city name like "Austin, Texas" or "Boston, MA"'],
      timestamp: new Date().toISOString()
    };
  }

  const cityLower = city.toLowerCase().trim();

  // Check for obviously fake patterns
  for (const pattern of fakeCityPatterns) {
    if (pattern.test(cityLower)) {
      return {
        message: 'There was an issue with the city field',
        details: `"${city}" appears to be a test or invalid city name`,
        problemField: 'city',
        suggestions: [
          'Enter a real city name (e.g., "Austin, Texas", "Boston, MA", "San Francisco, CA")',
          'Check spelling and try again',
          'Use the full city name with state if needed'
        ],
        timestamp: new Date().toISOString()
      };
    }
  }

  // Check if city is too short (likely not a real city)
  if (cityLower.length < 2) {
    return {
      message: 'There was an issue with the city field',
      details: 'City name is too short to be valid',
      problemField: 'city',
      suggestions: [
        'Enter a complete city name',
        'Use at least 2 characters',
        'Include state name if needed (e.g., "Austin, TX")'
      ],
      timestamp: new Date().toISOString()
    };
  }

  // Check if it's a simple word that's likely not a city
  const simpleCityName = cityLower.replace(/[,\s].*/, ''); // Remove state/country part
  if (simpleCityName.length >= 3 && !realCities.includes(simpleCityName) &&
      !cityLower.includes(',') && !cityLower.includes(' ')) {
    // If it's a single word that's not in our known cities list, be suspicious
    // But allow cities with state/country indicators
    if (!/^[a-z]{3,}$/i.test(simpleCityName)) {
      return {
        message: 'There was an issue with the city field',
        details: `"${city}" is not recognized as a valid city`,
        problemField: 'city',
        suggestions: [
          'Try adding the state or country (e.g., "Austin, Texas")',
          'Check the spelling of the city name',
          'Use a well-known city name',
          'Make sure you\'re entering a real location'
        ],
        timestamp: new Date().toISOString()
      };
    }
  }

  return null; // No validation errors
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.post('/api/activities', async (req, res) => {
  const { city, ages, availability, distance, preferences } = req.body;

  console.log('Search request:', { city, ages, availability, distance, preferences });

  // Validate input before making API calls
  const validationError = validateSearchInput({ city, ages, availability, distance, preferences });
  if (validationError) {
    return res.status(400).json({
      success: false,
      error: validationError,
      searchCriteria: { city, ages, availability, distance, preferences },
      source: 'validation-error'
    });
  }

  try {
    // Check if Claude API is enabled and API key is available
    const useClaudeAPI = process.env.USE_CLAUDE_API === 'true' && process.env.CLAUDE_API_KEY;

    let activities;

    if (useClaudeAPI) {
      console.log('Using Claude API for activity recommendations...');

      // Call Claude API for real recommendations
      activities = await getActivityRecommendations(
        city || 'San Francisco',
        ages || 'all ages',
        availability || 'weekend',
        distance || '10 miles',
        preferences || 'family-friendly'
      );

      // If we got fewer than 5 activities, that's okay - return what we found
      if (activities.length < 5) {
        console.log(`Got ${activities.length} activities from Claude (fewer than 5 requested)`);
      }

      // Add IDs to Claude activities if they don't have them
      activities = activities.map((activity, index) => ({
        id: index + 1,
        ...activity
      }));

    } else {
      console.log('Using dummy data (Claude API disabled or no API key)');
      activities = sampleActivities;
    }

    res.json({
      activities: activities,
      searchCriteria: { city, ages, availability, distance, preferences },
      source: useClaudeAPI ? 'claude-api' : 'dummy-data'
    });

  } catch (error) {
    console.error('Error getting activity recommendations:', error);

    // Return proper error response instead of dummy data
    let errorMessage = 'An unexpected error occurred while searching for activities';
    let errorDetails = error.message;
    let problemField = null;
    let suggestions = [];

    // Analyze error to identify problematic fields and provide specific guidance
    if (error.message.includes('API key')) {
      errorMessage = 'Claude API authentication failed';
      errorDetails = 'Please check your API key configuration';
      suggestions = ['Contact your administrator to verify the API key', 'Check if the API key has expired'];
    } else if (error.message.includes('rate limit') || error.message.includes('429')) {
      errorMessage = 'Rate limit exceeded';
      errorDetails = 'Too many requests. Please try again in a few minutes';
      suggestions = ['Wait a few minutes before trying again', 'Try searching for fewer activities at once'];
    } else if (error.message.includes('model')) {
      errorMessage = 'AI model unavailable';
      errorDetails = 'The requested AI model is not accessible';
      suggestions = ['Try again in a few minutes', 'Contact support if the issue persists'];
    } else if (error.message.includes('network') || error.message.includes('timeout')) {
      errorMessage = 'Network connectivity issue';
      errorDetails = 'Unable to connect to the AI service. Please check your internet connection';
      suggestions = ['Check your internet connection', 'Try again in a few moments'];
    } else if (error.message.includes('Max iterations')) {
      errorMessage = 'Search process took too long';
      errorDetails = 'The AI spent too much time searching and was stopped for efficiency';
      suggestions = ['Try a more specific search with fewer preferences', 'Use a more common city name'];
    } else {
      // Analyze search criteria to identify potential issues
      const searchText = `${city} ${preferences}`.toLowerCase();

      // Check for potentially problematic city names
      if (city && (city.length < 2 || /[^a-zA-Z\s\-,.]/.test(city))) {
        problemField = 'city';
        errorMessage = 'There was an issue with the city field';
        errorDetails = 'The city name appears to be invalid or not recognized';
        suggestions = [
          'Enter a real city name (e.g., "San Francisco", "New York", "Boston")',
          'Check spelling and try again',
          'Use the full city name instead of abbreviations'
        ];
      }
      // Check for nonsensical combinations
      else if (searchText.includes('fake') || searchText.includes('test') || searchText.includes('invalid')) {
        problemField = city && (city.toLowerCase().includes('fake') || city.toLowerCase().includes('test')) ? 'city' : 'preferences';
        errorMessage = `There was an issue with the ${problemField} field`;
        errorDetails = 'The search criteria contains invalid or test data';
        suggestions = [
          `Enter a real ${problemField === 'city' ? 'city name' : 'preference'}`,
          'Use genuine search criteria for best results',
          'Try searching for actual locations and activities'
        ];
      }
      // Check for extremely long or short inputs
      else if (city && city.length > 100) {
        problemField = 'city';
        errorMessage = 'There was an issue with the city field';
        errorDetails = 'The city name is too long';
        suggestions = ['Enter a shorter, more specific city name', 'Use just the city name without additional descriptions'];
      }
      // Generic search failure - could be unrecognized location
      else if (city && city.trim().length > 0) {
        problemField = 'city';
        errorMessage = 'There was an issue finding activities for the specified location';
        errorDetails = `No activities could be found for "${city}". This might be an unrecognized location or a very small area.`;
        suggestions = [
          'Try a nearby larger city or metropolitan area',
          'Check the spelling of the city name',
          'Use a more well-known location',
          'Try searching for the state or region instead'
        ];
      }
    }

    res.status(500).json({
      success: false,
      error: {
        message: errorMessage,
        details: errorDetails,
        problemField: problemField,
        suggestions: suggestions,
        timestamp: new Date().toISOString()
      },
      searchCriteria: { city, ages, availability, distance, preferences },
      source: 'error-response'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});