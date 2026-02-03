# HTN Events - Frontend Challenge

A visually polished events web app for Hackathon Global Inc. built with React, TypeScript, and Vite.

## Features

- **Public Events Browsing**: Browse public events without authentication
- **Private Events Access**: Log in to view both public and private events
- **Event Details**: View detailed information about each event including speakers, times, and descriptions
- **Related Events Navigation**: Easily navigate between related events
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Constellation Theme**: Black and white design with subtle constellation background effect

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **GraphQL Request** - GraphQL client
- **Tailwind CSS** - Styling

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the files

2. Install dependencies:
```bash
npm install
```

### Running the App

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is taken).

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Authentication

The app supports hardcoded login credentials for the challenge:

- **Username**: `hacker`
- **Password**: `htn2026`

When logged in, you'll have access to:
- Private events
- Private event URLs
- All public events

When logged out:
- Only public events are visible
- Private URLs are hidden

## Routes

- `/` - Landing page with scrolling sections
- `/about` - About page
- `/team` - Team page
- `/events` - Events list (main challenge view)
- `/events/:id` - Individual event detail page
- `/sponsors` - Sponsors page
- `/faq` - FAQ page
- `/login` - Login page

## Project Structure

```
src/
├── api/              # GraphQL client and queries
├── auth/             # Authentication context and hooks
├── components/
│   ├── events/      # Event-related components
│   ├── layout/      # Layout components (Navbar, Footer, AppShell)
│   └── ui/          # Reusable UI components (Button, Badge, Input)
├── pages/           # Page components
├── styles/          # Global styles
└── utils/           # Utility functions
```

## Data Source

Events are fetched from the GraphQL endpoint:
- **URL**: `https://api.hackthenorth.com/v3/frontend-challenge`
- **Query**: `sampleEvents` (for list) and `sampleEvent(id)` (for individual event)

## Design Principles

- **Accessibility**: Keyboard navigable, proper focus states, reduced motion support
- **Performance**: Lightweight constellation effect, optimized rendering
- **Simplicity**: Clean code, minimal abstractions, clear component structure

## License

This project is for the Hack the North 2026 Frontend Challenge.
