# Cache Valley Communities - Vue.js Application

A modern Vue.js application built with TypeScript, featuring reusable components and a clean, maintainable architecture.

## 🚀 Features

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vue Router** for client-side routing
- **Tailwind CSS** for styling
- **Reusable Components** for consistent UI
- **Responsive Design** for all devices
- **Modern Build Tools** with Vite

## 📁 Project Structure

```
update/
├── src/
│   ├── components/
│   │   └── ui/                 # Reusable UI components
│   │       ├── Button.vue
│   │       ├── Card.vue
│   │       ├── ContentCard.vue
│   │       ├── Navigation.vue
│   │       ├── Hero.vue
│   │       ├── Section.vue
│   │       └── Footer.vue
│   ├── layouts/
│   │   └── DefaultLayout.vue    # Main layout wrapper
│   ├── pages/                  # Route components
│   │   ├── Home.vue
│   │   ├── Organizations.vue
│   │   ├── Posts.vue
│   │   ├── Contributors.vue
│   │   ├── OrganizationDetail.vue
│   │   └── PostDetail.vue
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── App.vue                 # Root component
│   ├── main.ts                 # Application entry point
│   └── style.css               # Global styles
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🛠️ Reusable Components

### Button Component
```vue
<Button variant="primary" size="lg" @click="handleClick">
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `fullWidth`: boolean

### Card Component
```vue
<Card title="Card Title" description="Card description">
  <template #footer>
    <Button variant="primary">Action</Button>
  </template>
</Card>
```

### ContentCard Component
```vue
<ContentCard
  title="Post Title"
  description="Post summary"
  image="image.jpg"
  category="Technology"
  tags="['vue', 'typescript']"
  date="2025-01-18"
  link="/posts/slug"
/>
```

### Navigation Component
```vue
<Navigation :nav-links="navLinks" />
```

### Hero Component
```vue
<Hero
  title="Welcome"
  subtitle="To Our Community"
  description="Join us today"
  :actions="heroActions"
/>
```

### Section Component
```vue
<Section title="Section Title" background="white" padding="lg">
  <!-- Content -->
</Section>
```

## 🎨 Styling

The application uses Tailwind CSS with custom component classes:

- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, etc.
- **Cards**: `.card`, `.card-header`, `.card-body`, `.card-footer`
- **Layout**: `.container`, `.section`, `.section-title`
- **Colors**: Custom primary and secondary color palettes

## 📱 Pages

1. **Home** (`/`) - Landing page with featured content
2. **Organizations** (`/organizations`) - List of community organizations
3. **Posts** (`/posts`) - Blog posts and articles
4. **Contributors** (`/contributors`) - Community contributors
5. **Organization Detail** (`/organizations/:slug`) - Individual organization page
6. **Post Detail** (`/posts/:slug`) - Individual post page

## 🔧 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd update
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

## 🏗️ Architecture Decisions

### Component Design
- **Composition API**: Used throughout for better TypeScript support
- **Props Interface**: All components have typed props
- **Slots**: Flexible content areas with named slots
- **Events**: Proper event handling with TypeScript

### State Management
- **Local State**: Using Vue's reactive refs
- **No Global Store**: Simple state management for this application
- **API Integration**: Ready for external API integration

### Routing
- **File-based**: Pages organized by route
- **Dynamic Routes**: Support for parameterized routes
- **Type Safety**: Route parameters typed with props

### Styling
- **Utility-first**: Tailwind CSS for rapid development
- **Component Classes**: Custom CSS classes for complex components
- **Responsive**: Mobile-first design approach

## 🚀 Deployment

The application builds to static files that can be deployed to any static hosting service:

- **Netlify**: Connect repository for automatic deployments
- **Vercel**: Zero-config deployment
- **GitHub Pages**: Static site hosting
- **AWS S3**: Static website hosting

## 🔮 Future Enhancements

- **API Integration**: Connect to backend services
- **Content Management**: Headless CMS integration
- **Search**: Full-text search functionality
- **Authentication**: User accounts and permissions
- **Real-time**: WebSocket integration for live updates
- **PWA**: Progressive Web App features
- **Testing**: Unit and integration tests

## 📄 License

This project is part of the Cache Valley Communities initiative.
