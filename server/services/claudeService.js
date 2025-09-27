const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

const buildPrompt = (city, ages, availability, distance, preferences) => {
  return `You are a family activity finder assistant. Help parents discover perfect activities for their families based on their specific criteria.

**Family Details:**
- Location: ${city}
- Kids Ages: ${ages}
- Availability: ${availability}
- Maximum Distance: ${distance}
- Additional Preferences: ${preferences}

Please use the web search tool to find current, real activities and events that match these criteria. Then provide exactly 5 activity recommendations.

**Search Strategy:**
1. Search for family activities, events, and attractions in ${city}
2. Look for activities appropriate for ages ${ages}
3. Focus on activities available during ${availability}
4. Consider the ${distance} travel limitation
5. Include ${preferences} in your search criteria

**Output Format:**
For each recommendation, provide exactly this format:

🎨 **Activity Name - Typical Hours**
Description of the activity in 2-4 sentences explaining what families can do there and why it's great for kids these ages.
📍 Venue Name • Estimated distance

**Requirements:**
- All 5 recommendations must be real, current activities found through web search
- Include a mix of activity types (educational, entertainment, outdoor, cultural, etc.)
- Ensure activities are age-appropriate for the specified children
- Verify activities are available during the requested time period
- Stay within the specified distance range
- Consider the additional preferences provided

Please search for activities now and provide your 5 recommendations. After gathering sufficient information from 1-3 searches, please provide your final recommendations in the specified format.`;
};

const parseActivities = (responseText) => {
  const activities = [];
  const lines = responseText.split('\n');

  let currentActivity = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Look for lines that contain ** (activity titles)
    if (line.includes('**') && line.length > 0) {
      // Save previous activity if exists
      if (currentActivity) {
        activities.push(currentActivity);
      }

      // Extract emoji and title - find the ** markers
      const parts = line.split('**');
      if (parts.length >= 3) {
        const emojiPart = parts[0].trim();
        const titlePart = parts[1].trim();

        currentActivity = {
          emoji: emojiPart,
          title: `<strong>${titlePart}</strong>`,
          description: '',
          location: '',
          distance: ''
        };
      }
    }
    // Look for description lines (non-empty, not starting with location marker, not containing **)
    else if (currentActivity && line && !line.startsWith('📍') && !line.includes('**') && line.length > 20) {
      // Only add substantial lines as descriptions, skip short lines
      if (currentActivity.description) {
        currentActivity.description += ' ' + line;
      } else {
        currentActivity.description = line;
      }
    }
    // Look for location lines
    else if (currentActivity && line.startsWith('📍')) {
      const locationMatch = line.match(/📍\s*(.*?)\s*•\s*(.*)/);
      if (locationMatch) {
        currentActivity.location = locationMatch[1].trim();
        currentActivity.distance = locationMatch[2].trim();
      } else {
        // Fallback if format is different
        const cleanLine = line.replace('📍', '').trim();
        if (cleanLine.includes('•')) {
          const parts = cleanLine.split('•');
          currentActivity.location = parts[0].trim();
          currentActivity.distance = parts[1].trim();
        } else {
          currentActivity.location = cleanLine;
          currentActivity.distance = 'Distance not specified';
        }
      }
    }
  }

  // Add the last activity
  if (currentActivity) {
    activities.push(currentActivity);
  }

  return activities;
};

// Simulated web search function (in a real app, you'd use a proper search API)
const performWebSearch = async (query) => {
  console.log(`Performing web search for: ${query}`);

  // Generate realistic search results based on the query
  let mockResults = '';

  if (query.includes('San Francisco') && query.includes('museum')) {
    mockResults = `Search results for "${query}":

**Exploratorium - San Francisco**
- Address: Pier 15, San Francisco, CA 94111
- Hours: Saturday 10am-5pm
- Family-friendly interactive science museum
- Perfect for ages 8-12 with hands-on exhibits
- Distance: 2.5 miles from downtown SF
- Admission: Adults $29, Youth (13-17) $24, Children (4-12) $19

**California Academy of Sciences**
- Address: 55 Music Concourse Dr, Golden Gate Park
- Hours: Saturday 9:30am-5pm
- Features planetarium, aquarium, rainforest dome, natural history museum
- Great for educational experiences and all ages
- Distance: 3.2 miles from downtown SF
- Admission: Adults $39.95, Youth (12-17) $34.95, Children (4-11) $29.95

**Children's Creativity Museum**
- Address: 221 4th St, Yerba Buena Gardens
- Hours: Saturday 10am-4pm
- Hands-on multimedia arts and technology activities
- Perfect for kids 2-12 years old
- Distance: 1.8 miles from downtown SF
- Admission: $12 per person

**SFMOMA (San Francisco Museum of Modern Art)**
- Address: 151 3rd St, San Francisco
- Hours: Saturday 10am-5pm
- Modern and contemporary art collections
- Family programs and art-making activities
- Distance: 1.5 miles from downtown SF
- Admission: Adults $25, Seniors/Students $22, Ages 18 & under FREE`;

  } else if (query.includes('Golden Gate Park') || query.includes('outdoor')) {
    mockResults = `Search results for "${query}":

**Golden Gate Park - Multiple Attractions**
- Japanese Tea Garden: Traditional garden with pagodas and tea house
- Saturday hours: 9am-6pm, $10 adults, $7 youth/seniors, children 4 & under free
- Distance: 3.5 miles from downtown

**Crissy Field**
- Large open space with Golden Gate Bridge views
- Free outdoor recreation area
- Perfect for picnics and outdoor activities
- Distance: 2.8 miles from downtown

**Aquatic Cove and Maritime Museum**
- Historic ships and maritime exhibits
- Saturday hours: 9:30am-5pm
- Free admission to some areas
- Distance: 2.2 miles from downtown`;

  } else {
    mockResults = `Search results for "${query}":

**General San Francisco Family Activities**
- Alcatraz Island Tours: Historic prison tours, advance booking required
- Lombard Street: Famous "crookedest street" for sightseeing
- Fisherman's Wharf: Entertainment, street performers, sea lions
- Union Square: Shopping and entertainment district
- Chinatown: Cultural exploration and dim sum restaurants
- Cable Car Rides: Historic transportation and city tours

**Weekend Events (Saturday afternoons)**
- Farmers markets in various neighborhoods
- Street festivals and outdoor concerts (seasonal)
- Family-friendly walking tours
- Outdoor movie screenings (weather permitting)`;
  }

  return mockResults;
};

const getActivityRecommendations = async (city, ages, availability, distance, preferences) => {
  try {
    console.log('Making Claude API request...');

    const prompt = buildPrompt(city, ages, availability, distance, preferences);

    let messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          }
        ]
      }
    ];

    let maxIterations = 5; // Prevent infinite loops
    let iteration = 0;

    while (iteration < maxIterations) {
      iteration++;
      console.log(`Claude API iteration ${iteration}...`);

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: messages,
        tools: [
          {
            name: "web_search",
            description: "Search the web for current information",
            input_schema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query"
                }
              },
              required: ["query"]
            }
          }
        ]
      });

      console.log(`Claude response received (iteration ${iteration})`);

      // Check if Claude wants to use tools
      let needsToolUse = false;
      let toolResults = [];

      for (const content of response.content) {
        if (content.type === 'tool_use') {
          needsToolUse = true;
          console.log(`Tool use requested: ${content.name} with query: ${content.input.query}`);

          // Execute the web search
          const searchResults = await performWebSearch(content.input.query);

          toolResults.push({
            type: "tool_result",
            tool_use_id: content.id,
            content: searchResults
          });
        }
      }

      if (needsToolUse) {
        // Add Claude's response to the conversation
        messages.push({
          role: "assistant",
          content: response.content
        });

        // Add tool results to the conversation
        messages.push({
          role: "user",
          content: toolResults
        });

        // Continue the conversation
        continue;
      } else {
        // No more tool use needed, extract the final response
        let finalText = '';

        for (const content of response.content) {
          if (content.type === 'text') {
            finalText += content.text;
          }
        }

        console.log('Parsing activities from final response...');
        console.log('=== FINAL TEXT FROM CLAUDE ===');
        console.log(finalText);
        console.log('=== END FINAL TEXT ===');
        const activities = parseActivities(finalText);

        console.log(`Parsed ${activities.length} activities`);

        // Ensure we have exactly 5 activities
        if (activities.length < 5) {
          console.warn(`Only found ${activities.length} activities, expected 5`);
        }

        return activities.slice(0, 5); // Return up to 5 activities
      }
    }

    throw new Error(`Max iterations (${maxIterations}) reached without getting final response`);

  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
};

module.exports = {
  getActivityRecommendations,
  buildPrompt,
  parseActivities
};