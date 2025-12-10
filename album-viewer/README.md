# Album Viewer

A modern Vue.js 3 application built with TypeScript that displays albums from the albums API.

## Features

- 🎵 Display album collection in a beautiful grid layout
- 🛒 Shopping cart functionality with persistent storage
- 🎨 Modern, responsive design with gradient background
- 🖼️ Album cover images with hover effects
- 💰 Price display for each album
- 🌍 Multi-language support (English, French, German)
- 📱 Mobile-friendly responsive design
- ⚡ Built with Vue 3, TypeScript, and Vite
- 🔧 Full TypeScript support with type safety
- 📝 Modern Composition API with `<script setup>`

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TypeScript knowledge (helpful but not required)
- The albums-api should be running on `http://localhost:3000`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3001`

## API Integration

The app fetches album data from the albums API endpoint `/albums`. Make sure the albums-api is running before starting the Vue app.

The API should return albums in the following format:
```json
[
  {
    "id": 1,
    "title": "Album Title",
    "artist": "Artist Name",
    "price": 10.99,
    "image_url": "https://example.com/image.jpg"
  }
]
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (with TypeScript compilation)
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking without building
- `npm run test` - Run unit tests with Vitest

## Project Structure

```
album-viewer/
├── src/
│   ├── components/
│   │   ├── AlbumCard.vue      # Individual album card component (TypeScript)
│   │   ├── CartIcon.vue       # Shopping cart icon with badge
│   │   └── CartDrawer.vue     # Cart drawer/modal component
│   ├── stores/
│   │   └── cart.ts            # Pinia cart store with localStorage
│   ├── types/
│   │   └── album.ts           # TypeScript type definitions
│   ├── i18n/
│   │   ├── en.ts              # English translations
│   │   ├── fr.ts              # French translations
│   │   └── de.ts              # German translations
│   ├── App.vue                # Main app component (TypeScript)
│   └── main.ts                # App entry point (TypeScript)
├── index.html                 # HTML template
├── vite.config.ts             # Vite configuration (TypeScript)
├── vitest.config.ts           # Vitest test configuration
├── tsconfig.json              # TypeScript configuration
├── tsconfig.app.json          # App-specific TypeScript config
├── env.d.ts                   # Environment type declarations
└── package.json               # Dependencies and scripts
```

## Technologies Used

- Vue 3 (Composition API with `<script setup>`)
- TypeScript (Static type checking and better developer experience)
- Pinia (State management for shopping cart)
- Vite (Build tool with TypeScript support)
- Vitest (Unit testing framework)
- Vue I18n (Internationalization support)
- Axios (HTTP client with TypeScript generics)
- CSS3 (Grid, Flexbox, Animations)

## TypeScript Features

This application leverages TypeScript for enhanced development experience:

- **Type Safety**: All components, functions, and data structures are strongly typed
- **Interface Definitions**: Clear contracts for data structures (Album interface)
- **Better IDE Support**: Enhanced IntelliSense, auto-completion, and error detection
- **Compile-time Error Checking**: Catch errors before runtime
- **Modern Vue 3 Syntax**: Uses `<script setup lang="ts">` for optimal TypeScript integration

## Features in Detail

### Shopping Cart
The app includes a fully functional shopping cart:
- **Add to Cart**: Click the "Add to Cart" button on any album card to add it to your cart
- **Cart Icon**: A shopping cart icon in the header displays the number of items in your cart
- **Cart Drawer**: Click the cart icon to open a slide-out drawer showing all items in your cart
- **Remove Items**: Each item in the cart can be removed individually
- **Clear Cart**: Empty your entire cart with a single click
- **Persistent Storage**: Your cart is saved to localStorage and persists across page refreshes
- **No Duplicates**: Each album can only be added once to the cart
- **Visual Feedback**: Buttons show when an album is already in the cart

### Album Cards
Each album is displayed in a card with:
- Album cover image
- Title and artist information
- Price display
- Hover effects with play button overlay
- Add to Cart and Preview buttons

### Responsive Design
The app adapts to different screen sizes:
- Desktop: Multi-column grid layout with side-by-side controls
- Mobile: Single column layout with stacked buttons and controls

### Internationalization
Full multi-language support:
- Switch between English, French, and German using the language selector
- All UI elements, including cart labels, are translated
- Language preference updates instantly across the app

### Error Handling
- Loading spinner while fetching data
- Error message with retry button if API is unavailable
- Fallback placeholder image for broken album covers
