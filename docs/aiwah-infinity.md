# Aiwah Infinity - Developer Guide

Complete technical overview of the Aiwah Infinity codebase architecture and development patterns.

## Architecture Overview

**Stack**: Next.js 15 + React 18 + TypeScript + Supabase + OpenRouter + Chakra UI

**Structure**:
- **Frontend**: Next.js App Router with TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **AI**: OpenRouter API for multiple LLM providers
- **Styling**: Chakra UI + custom dark theme
- **State**: React hooks with context providers

**Applications**:
1. **Home** (`/home`) - App launcher and navigation hub
2. **Chat** (`/chat`) - AI conversation interface  
3. **Ghostwriter** (`/ghostwriter`) - Document management system

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── home/              # Global home page
│   ├── chat/              # Chat application
│   ├── ghostwriter/       # Document management
│   └── auth/              # Authentication
├── components/            # Global/shared components
│   ├── AppLayout.tsx      # Main app wrapper
│   ├── AppHeader.tsx      # Navigation header
│   └── theme/             # Theme configuration
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and integrations
└── types/                 # TypeScript definitions
```

## Core Systems

### Navigation & Loading

**Global Loading System**:
- `NavigationLoadingProvider` detects route changes, shows loading for 200ms
- `AppLayout` wraps all protected pages, shows skeleton during navigation
- Prevents flickering with single loading source

**Header Navigation**:
- **HomeIcon**: Identical 14px icon in 32px container across all contexts
- **Breadcrumbs**: Hierarchical navigation with visual state indicators
- **Layout variants**: 'home' (icon only) vs 'app' (breadcrumbs)
- **Color coding**: teal (clickable), white/gray (current), subdued arrows

### Layout Pattern

```tsx
// LAYOUT LEVEL: AppLayout with dynamic breadcrumbs
export default function FeatureLayout({ children }) {
  const pathname = usePathname();
  
  const getBreadcrumbs = () => [
    { label: 'Home', href: '/home', icon: FiHome },
    { label: 'Feature', href: '/feature', icon: FeatureIcon, isActive: pathname === '/feature' },
  ];

  return (
    <AppLayout appName="Feature" appIcon={FeatureIcon} variant="app" breadcrumbs={getBreadcrumbs()}>
      {children}
    </AppLayout>
  );
}

// PAGE LEVEL: Content only, AppLayout handles scrolling
export default function Page() {
  return (
    <AuthGuard>
      <Box h="100%" overflow="auto" p={8}>
        <YourContent />
      </Box>
    </AuthGuard>
  );
}
```

### Authentication

- **AuthGuard**: Protects routes, handles redirects
- **AuthProvider**: Global auth state management
- **Supabase Auth**: Handles authentication flow

```tsx
// Protect routes
<AuthGuard>
  <PageContent />
</AuthGuard>

// Use auth state
const { user, isAuthenticated } = useAuth();
```

## Component Architecture

### Key Components

**AppLayout** - Main wrapper for protected pages
- Fixed viewport, components handle own scrolling
- Consistent header/footer structure
- Navigation loading integration

**AppHeader** - Seamless navigation with breadcrumbs
- HomeIcon component for visual consistency
- Dynamic breadcrumb generation
- Consistent 32px height, balanced padding

**Component Patterns**:
```tsx
// Layout components
<AppLayout appName="Feature" appIcon={FeatureIcon}>
  <FeatureContent />
</AppLayout>

// Loading states
{loading ? <Spinner color="teal.400" size="lg" /> : <Content />}

// Error handling
{error && (
  <Box textAlign="center" p={6} color="red.400">
    <Text>{error}</Text>
    <Button onClick={retry}>Retry</Button>
  </Box>
)}

// Scrolling areas
<Box h="400px" overflow="auto">
  <LongContentList />
</Box>
```

## Styling & Theming

**Dark Mode Only**: Consistent dark UI across application

**Color Palette**:
```typescript
brand: { 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488' }
gray: { 700: '#404040', 800: '#262626', 900: '#171717' }
```

**Usage**:
```tsx
<Box bg="gray.800" color="gray.100" borderColor="gray.700">
```

**Responsive**: 800x500px minimum, warning below threshold

## Database & Backend

### Supabase Setup

```typescript
// Client configuration
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// CRUD operations
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('user_id', userId);

// Real-time subscriptions
useEffect(() => {
  const subscription = supabase
    .channel('changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'table' }, handleData)
    .subscribe();
  return () => subscription.unsubscribe();
}, []);
```

## Development Setup

### Prerequisites & Installation

```bash
# Requirements
Node.js >= 18.0.0, npm >= 9.0.0

# Setup
git clone <repository-url>
cd aiwah-infinity
npm install
cp .env.example .env.local
# Configure environment variables
npm run dev
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_key

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint checks
npm run type-check   # TypeScript validation
```

## Development Patterns

### Code Organization

**Feature-First Structure**:
```
src/app/feature/
├── layout.tsx     # Feature layout with providers
├── page.tsx       # Main feature page
└── components/    # Feature-specific components
```

**Hook Patterns**:
```typescript
export function useFeature() {
  const [state, setState] = useState();
  const [loading, setLoading] = useState(false);
  
  const action = useCallback(async () => {
    setLoading(true);
    try {
      // Action logic
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { state, loading, action };
}
```

### Error Handling

```typescript
// API errors
try {
  const { data, error } = await supabase.from('table').select();
  if (error) throw error;
} catch (error) {
  toast({ title: 'Error', description: error.message, status: 'error' });
}

// Component errors
function ErrorFallback({ error }) {
  return (
    <Box p={6} textAlign="center">
      <Text color="red.400">Something went wrong</Text>
      <Button onClick={() => window.location.reload()}>Reload</Button>
    </Box>
  );
}
```

### Performance

```typescript
// Memoization
const value = useMemo(() => heavyCalculation(data), [data]);
const handleClick = useCallback(() => {}, [dependencies]);

// Component optimization
export const Component = React.memo(function Component({ prop }) {
  return <div>{prop}</div>;
});
```

## Contributing

### Workflow

1. **Branch**: `git checkout -b feature/name`
2. **Code**: Follow TypeScript strict mode, component patterns
3. **Test**: `npm run type-check && npm run lint && npm run build`
4. **Commit**: `git commit -m "feat: description"`
5. **PR**: Include description and screenshots

### Standards

- **TypeScript**: Strict mode, proper interfaces, avoid `any`
- **React**: Functional components, hooks, handle loading/error states
- **Styling**: Chakra UI, theme conventions, responsive design
- **Organization**: Feature-first, consistent naming, named exports

### Adding Features

1. Plan data flow and authentication requirements
2. Create directory structure in `src/app/new-feature/`
3. Implement layout, page, components, and hooks
4. Add navigation links and test integration
5. Ensure consistent styling and error handling

This guide covers essential patterns for Aiwah Infinity development. All components follow these architectural principles for consistency and maintainability. 