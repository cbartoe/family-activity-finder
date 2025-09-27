# 🎯 Family Activity Finder

A web application that helps parents discover perfect activities for their families using AI-powered recommendations.

## 📋 Project Overview

Family Activity Finder allows parents to input their preferences (city, kids' ages, availability, travel distance, and other preferences) and receive 5 curated activity recommendations with detailed descriptions, locations, and distances.

## ✨ Features

- **Smart Search Form**: Simple text inputs for maximum flexibility
- **AI-Powered Recommendations**: Uses Claude API with Web Search for real-time activity discovery
- **Beautiful UI**: Responsive two-panel design with blue color scheme
- **Activity Cards**: Each recommendation includes emoji, title, description, location, and distance
- **Mobile Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Cost Controls**: API usage toggles and monitoring for budget management

## 🛠 Tech Stack

### Frontend
- **React** - Modern UI library with hooks
- **CSS Modules** - Scoped styling
- **Responsive Design** - Mobile-first approach

### Backend
- **Express.js** - Web application framework
- **Node.js** - JavaScript runtime
- **Claude Messages API** - AI-powered activity recommendations
- **Web Search Tool** - Real-time activity discovery

### Development Tools
- **concurrently** - Run frontend and backend together
- **nodemon** - Development server with hot reload

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Claude API key (for Milestone 2)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cbartoe/family-activity-finder.git
   cd family-activity-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (for Milestone 2)
   ```bash
   cd server
   cp .env.example .env
   # Add your CLAUDE_API_KEY to .env
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
family-activity-finder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── SearchForm.js
│   │   │   ├── ActivityList.js
│   │   │   └── ActivityCard.js
│   │   ├── App.js          # Main app component
│   │   └── App.css         # Global styles
│   └── public/
├── server/                 # Express backend
│   ├── services/           # API integrations (Milestone 2)
│   ├── server.js           # Main server file
│   └── package.json
├── spec.md                 # Project specifications
├── prompt.md               # Claude API prompt template
├── todo.md                 # Development task tracking
└── README.md               # This file
```

## 🎯 Development Milestones

### ✅ Milestone 1: UI Setup with Dummy Data - COMPLETED
- Complete React frontend with responsive design
- Express backend with dummy data API
- Working form submission and activity display
- Mobile-responsive layout matching mockup

### 🔧 Milestone 2: Claude API + Web Search Integration - IN PROGRESS
- Claude Messages API integration
- Web Search tool for real-time activity discovery
- Dynamic activity recommendations
- Cost control and API monitoring

### 📋 Milestone 3: Polish & Deploy - PLANNED
- Production deployment
- Enhanced UX features
- Performance optimization
- Testing suite

## 🧪 Testing

**Current Status (Milestone 1):**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Test search: Enter "San Francisco" and click "Search Activities"
- Expected: 5 dummy activities with emoji, titles, descriptions

**API Endpoint Testing:**
```bash
curl -X POST http://localhost:3001/api/activities \
  -H "Content-Type: application/json" \
  -d '{"city":"San Francisco","ages":"7,10","availability":"Sunday afternoon","distance":"10 miles","preferences":"educational"}'
```

## 🔧 Available Scripts

- `npm run dev` - Start both frontend and backend servers
- `npm run client` - Start only React frontend
- `npm run server` - Start only Express backend

## 🎨 Design Guidelines

- **Color Scheme**: Blue primary (#4F86F7), white background
- **Typography**: Clean, readable fonts with clear hierarchy
- **Layout**: Two-panel design (form left, results right)
- **Mobile**: Responsive grid system with stacked layout

## 💡 Sample Activities (Milestone 1)

1. 🚋 **Muni Heritage Weekend** - Vintage transit rides in San Francisco
2. 🇬🇷 **Greek Food Festival** - Traditional food and cultural performances
3. 🎨 **Sunday Funnies Exhibit** - Comic strip showcase at Cartoon Art Museum
4. 🌳 **Lindy in the Park** - Free swing dancing in Golden Gate Park
5. 🦋 **Butterfly Garden Workshop** - Educational nature activity for families

## 🔐 Environment Variables

```bash
# Server Environment (.env)
CLAUDE_API_KEY=your_claude_api_key_here
USE_CLAUDE_API=true
PORT=3001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: Built with Claude Code assistance
- **Design**: Based on provided mockup specifications

## 🔄 Version History

- **v1.0.0** - Milestone 1: Complete UI with dummy data
- **v2.0.0** - Milestone 2: Claude API integration (planned)
- **v3.0.0** - Milestone 3: Production deployment (planned)

---

**🎯 Family Activity Finder** - Discover perfect activities for your family!