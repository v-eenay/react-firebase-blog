# React Blog Application

A modern blog platform built with React, Tailwind CSS, and Firebase featuring retro newspaper aesthetics.

## Features

- 📰 Retro-styled article layouts with newspaper-inspired typography
- 🔐 User authentication system with email/password
- 📝 Rich text blog post creation and editing
- 🔍 Search functionality with category filtering
- 💬 Comment system with real-time updates
- 📈 Post analytics (views, likes)
- 📱 Responsive design for all screen sizes

## Technologies

- ⚛️ React 18 + TypeScript
- 🔥 Firebase Authentication & Firestore
- 🎨 Tailwind CSS with custom retro theme
- 🌀 Framer Motion animations
- 📦 Vite build tool

## Installation

1. Clone the repository:

```bash
git clone https://github.com/v-eenay/react-firebase-blog.git
```

2. Install dependencies:

```bash
cd react-firebase-blog
npm install
```

3. Create Firebase configuration:

```bash
# Create .env file in root directory
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. Start development server:

```bash
npm run dev
```

## Firebase Setup

1. Create new Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password method)
3. Create Firestore Database in test mode
4. Create 'posts' and 'categories' collections
5. Add web app and copy configuration to .env file

## Available Scripts

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
}
```

## Project Structure

```
/src
├── components/    # Reusable UI components
├── contexts/      # Auth context provider
├── firebase/      # Firebase configuration
├── pages/         # Route components
├── styles/        # Custom CSS styles
└── types/         # TypeScript interfaces
```

## Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Contact

**Vinay Koirala**
Lecturer - Itahari International College
📧 Professional: binaya.koirala@iic.edu.np
📧 Personal: koiralavinay@gmail.com
🐱 GitHub: https://github.com/v-eenay/react-firebase-blog.git
