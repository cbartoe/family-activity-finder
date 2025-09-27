const express = require('express');
const cors = require('cors');
require('dotenv').config();

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

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.post('/api/activities', (req, res) => {
  const { city, ages, availability, distance, preferences } = req.body;

  // For now, return the sample activities regardless of input
  // In Milestone 2, we'll integrate with Claude API
  console.log('Search request:', { city, ages, availability, distance, preferences });

  res.json({
    activities: sampleActivities,
    searchCriteria: { city, ages, availability, distance, preferences }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});