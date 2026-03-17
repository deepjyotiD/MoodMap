# MoodMap 🎯

A modern, interactive mood tracking application that helps you understand and visualize your emotional patterns over time.

## Features

- **Mood Logger** - Quick and easy mood logging with customizable mood levels
- **Dashboard** - Beautiful overview of your mood trends and recent entries
- **Analytics** - Deep dive into your mood data with interactive charts
- **Calendar View** - Visualize your moods across months and identify patterns
- **Progress Tracking** - Track your emotional journey and see improvements
- **Insights** - AI-generated insights about your mood patterns
- **3D Mood Sphere** - Interactive 3D visualization of your mood space
- **Custom Cursor** - Smooth, minimalist animated cursor
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Date Handling**: date-fns
- **Styling**: CSS3 with CSS Variables

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd MoodMap
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Cursor.jsx       # Custom animated cursor
│   ├── MoodLogger.jsx   # Mood entry component
│   ├── MoodSphere.jsx   # 3D mood visualization
│   └── Sidebar.jsx      # Navigation sidebar
├── pages/
│   ├── Dashboard.jsx    # Main dashboard
│   ├── AnalyticsPage.jsx # Analytics and charts
│   ├── CalendarPage.jsx # Calendar view
│   ├── ProgressPage.jsx # Progress tracking
│   ├── InsightsPage.jsx # Insights and patterns
│   └── SettingsPage.jsx # User settings
├── store/
│   └── moodStore.js     # State management
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Available Scripts

### `npm run dev`
Starts the development server with hot module reloading.

### `npm run build`
Builds the app for production to the `dist` folder.

### `npm run lint`
Runs ESLint to check code quality.

### `npm run preview`
Previews the production build locally.

## Usage

1. **Log a Mood** - Click the mood logger button and select your current mood (1-5 scale)
2. **View Dashboard** - See your latest mood entries and trends
3. **Analyze** - Check the Analytics page for detailed mood patterns
4. **Calendar** - Navigate through months to see your mood history
5. **Insights** - Get personalized insights about your mood patterns
6. **Settings** - Customize your experience and preferences

## Color Scheme

The app uses a premium light theme with:
- **Primary**: Purple (#7c3aed)
- **Accents**: Indigo, Blue, Cyan, Pink
- **Mood Levels**: Green (Happy) → Amber → Orange → Red (Sad)

## Features in Development

- [ ] Multi-user support
- [ ] Cloud synchronization
- [ ] Export mood data
- [ ] Mood triggers analysis
- [ ] Integration with health apps
- [ ] Mood recommendations

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## License

This project is open source and available under the MIT License.

## Support

For support, please open an issue on the repository.

---

Made with 💜 by the MoodMap team
