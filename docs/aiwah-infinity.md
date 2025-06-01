# Aiwah Infinity - Comprehensive Developer Documentation

This document provides a complete technical overview of the Aiwah Infinity codebase architecture, general patterns, and development guidelines. F

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Development Setup](#development-setup)
5. [Core Systems](#core-systems)
6. [Component Architecture](#component-architecture)
7. [Styling & Theming](#styling--theming)
8. [Database & Backend](#database--backend)
9. [Authentication System](#authentication-system)
10. [Development Patterns](#development-patterns)
11. [Build & Deployment](#build--deployment)
12. [Testing Strategy](#testing-strategy)
13. [Contributing Guidelines](#contributing-guidelines)

## Architecture Overview

### High-Level Architecture

Aiwah Infinity is a modern full-stack web application built with:
- **Frontend**: Next.js 15 with App Router, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **AI**: OpenRouter API integration for multiple LLM providers
- **Styling**: Chakra UI + Saas UI with custom theming
- **State Management**: React hooks with context providers
- **Real-time**: Supabase real-time subscriptions

### Application Flow

```
User Interface (Next.js/React)
    ↓
Component Layer (Chakra UI + Custom Components)
    ↓
State Management (React Context + Hooks)
    ↓
API Layer (Supabase Client + OpenRouter)
    ↓
Backend Services (Supabase + OpenRouter APIs)
```

### Key Design Principles

1. **Component Isolation**: Each feature has its own components directory
2. **Global Navigation Loading**: Single loading system for all route transitions
3. **Fixed Layout System**: AppLayout provides fixed viewport, components handle their own scrolling
4. **Layout-Level Navigation**: AppLayout at layout level with dynamic breadcrumbs prevents flickering
5. **Dark Mode Only**: Simplified theming with consistent dark UI
6. **Type Safety**: Full TypeScript coverage with strict mode
7. **Real-time Updates**: Live data synchronization via Supabase
8. **Responsive Design**: Minimum 800x500px screen requirement

### Application Structure

The application consists of three main areas:

1. **Home** (`/home`) - Global app launcher and navigation hub
2. **Chat** (`/chat`) - AI-powered conversation interface  
3. **Ghostwriter** (`/ghostwriter`) - Document management and creation system

### Navigation Design

The application features a seamless navigation system with visual continuity:

- **Home Page**: Shows only a home icon (white, non-clickable) in the header
- **App Pages**: Display breadcrumb navigation with consistent styling
- **Visual Continuity**: Navigation transitions only add new elements, never change existing ones
- **Consistent Sizing**: All header elements use 32px height with balanced padding

### Breadcrumb Navigation

Dynamic breadcrumb navigation provides hierarchical context:
- **Home Icon**: Always appears identically (14px icon, 32px container)
- **Clickable Elements**: Teal color with hover effects
- **Active Elements**: Gray color, non-clickable appearance  
- **Smooth Transitions**: No layout shifts during navigation

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.1 | React framework with App Router |
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Type safety and developer experience |
| **Chakra UI** | 2.x | Component library |
| **Saas UI** | 2.x | Enterprise UI components |
| **Tailwind CSS** | 3.x | Utility classes (minimal usage) |

### Backend & Services

| Service | Purpose |
|---------|---------|
| **Supabase** | Database, authentication, real-time |
| **OpenRouter** | AI model API aggregation |
| **Vercel** | Deployment platform |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Husky** | Git hooks |
| **TypeScript Compiler** | Type checking |

## Project Structure

### Root Directory

```
aiwah-infinity/
├── .next/                 # Next.js build output
├── public/               # Static assets
├── src/                  # Application source code
├── supabase/            # Supabase configuration
├── docs/                # Documentation
├── migrations/          # Database migrations
├── next.config.ts       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies
└── README.md           # Basic project info
```

### Source Code Structure (`src/`)

```
src/
├── app/                         # Next.js App Router
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Entry point (redirects)
│   ├── globals.css             # Global styles
│   ├── responsive.css          # Responsive design rules
│   ├── home/                   # Global home page
│   │   ├── layout.tsx          # Home layout
│   │   └── page.tsx            # App selection page
│   ├── chat/                   # Chat application
│   │   ├── layout.tsx          # Chat layout with providers
│   │   ├── page.tsx            # Main chat page
│   │   └── components/         # Chat-specific components
│   ├── ghostwriter/            # Document management
│   │   ├── layout.tsx          # Ghostwriter layout
│   │   ├── page.tsx            # Main page
│   │   ├── document/[id]/      # Document detail pages
│   │   └── components/         # Ghostwriter components
│   └── auth/                   # Authentication pages
├── components/                  # Global/shared components
│   ├── AppLayout.tsx           # Main app layout wrapper
│   ├── AppHeader.tsx           # Application header
│   ├── Footer.tsx              # Application footer
│   ├── AuthGuard.tsx           # Authentication protection
│   ├── NavigationLoadingProvider.tsx # Global loading
│   └── theme/                  # Theme configuration
├── hooks/                      # Custom React hooks
│   ├── auth/                   # Authentication hooks
│   ├── chat/                   # Chat functionality hooks
│   └── documents/              # Document management hooks
├── lib/                        # Shared utilities
│   ├── ai/                     # AI integration utilities
│   ├── supabase/              # Supabase client & types
│   └── utils/                  # General utilities
└── types/                      # TypeScript type definitions
```

## Development Setup

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git
```

### Initial Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd aiwah-infinity
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Required Environment Variables**
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

5. **Database Setup**
   ```bash
   # Run any pending migrations
   npm run db:migrate
   
   # Generate TypeScript types
   npm run db:generate-types
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm run db:migrate   # Run database migrations
npm run db:reset     # Reset database
```

## Core Systems

### Navigation & Loading System

The application uses a global navigation loading system to provide smooth transitions:

**NavigationLoadingProvider** (`src/components/NavigationLoadingProvider.tsx`)
- Detects route changes using `usePathname()`
- Shows loading state for 200ms on navigation
- Prevents flickering with single loading source

**AppLayout** (`src/components/AppLayout.tsx`)
- Wraps all protected pages
- Shows skeleton during navigation
- Maintains header/footer structure
- Passes variant and breadcrumbs to AppHeader

**AppHeader** (`src/components/AppHeader.tsx`)
- Displays seamless navigation with dynamic breadcrumbs
- HomeIcon component ensures visual consistency across all contexts
- All elements use consistent 32px height and balanced padding (px={2}, py={1})
- Automatic layout based on variant ('home' vs 'app') and breadcrumb presence

**Usage Pattern:**
```tsx
// Page layouts with breadcrumbs
<AppLayout 
  appName="Your App" 
  appIcon={YourIcon}
  variant="app"
  breadcrumbs={getBreadcrumbs()}
>
  <YourPageContent />
</AppLayout>

// Home page layout
<AppLayout 
  appName="Home" 
  appIcon={FiHome}
  variant="home"
>
  <HomePageContent />
</AppLayout>
```

### Authentication Flow

**AuthGuard** (`src/components/AuthGuard.tsx`)
- Protects routes that require authentication
- Handles redirects after login/logout
- Integrates with navigation loading

**AuthProvider** (`src/components/AuthProvider.tsx`)
- Manages global auth state
- Provides auth context to entire app

**Flow:**
1. User visits protected route
2. AuthGuard checks authentication
3. Redirects to `/login` if not authenticated
4. After login, redirects to original destination or `/home`

### Home System

The home page (`/home`) serves as the main entry point and navigation hub:

**Home Layout** (`src/app/home/layout.tsx`)
- Uses AppLayout with variant="home" for proper header display
- Shows only home icon (white, non-clickable) in header
- No additional providers needed
- Simple, clean layout

**Home Page** (`src/app/home/page.tsx`)
- Shows available applications (Chat, Ghostwriter)
- Card-based navigation interface
- Links to sub-applications

**Home Features:**
- App launcher interface
- Consistent navigation
- Visual app cards with icons
- Hover effects and transitions

## Component Architecture

### Component Organization

Components are organized by scope:

1. **Global Components** (`src/components/`)
   - Used across multiple features
   - Layout components (AppLayout, AppHeader)
   - Providers (Auth, Theme, Navigation)

2. **Feature Components** (`src/app/[feature]/components/`)
   - Specific to one feature/page
   - Isolated from other features
   - Follow feature-first organization

### Component Patterns

**1. Layout Components**
```tsx
// Always use AppLayout for protected pages
export default function FeaturePage() {
  return (
    <AppLayout appName="Feature" appIcon={FeatureIcon}>
      <FeatureContent />
    </AppLayout>
  );
}
```

**2. Context Providers**
```tsx
// Feature-specific providers in layouts
export default function FeatureLayout({ children }) {
  return (
    <AppLayout appName="Feature" appIcon={FeatureIcon}>
      <FeatureProvider>
        {children}
      </FeatureProvider>
    </AppLayout>
  );
}
```

**3. Loading States**
```tsx
// Use simple loading indicators
{loading ? (
  <Center p={8}>
    <Spinner color="teal.400" size="lg" />
  </Center>
) : (
  <YourContent />
)}
```

**4. Error Handling**
```tsx
// Consistent error display
{error && (
  <Box textAlign="center" p={6} color="red.400">
    <Text>{error}</Text>
    <Button onClick={retry} mt={4}>Retry</Button>
  </Box>
)}
```

**5. Scrolling Pattern**
```tsx
// AppLayout is fixed - components handle their own scrolling
export default function YourPage() {
  return (
    <AuthGuard>
      <Box h="100%" overflow="auto" p={8}>
        <YourScrollableContent />
      </Box>
    </AuthGuard>
  );
}

// For components that need internal scrolling
<Box h="400px" overflow="auto">
  <LongContentList />
</Box>
```

**6. Breadcrumb Navigation**
```tsx
// Define breadcrumbs for hierarchical navigation
const breadcrumbs = [
  {
    label: 'Home',  // Label for identification - HomeIcon shows only icon
    href: '/home',
    icon: FiHome,
  },
  {
    label: 'Ghostwriter',
    href: '/ghostwriter',
    icon: FiFileText,
  },
  {
    label: 'Approved',
    href: '/ghostwriter/approved',
    icon: FiCheckCircle,
    isActive: true, // Current page - gray, non-clickable
  },
];

// Use in AppLayout with dynamic breadcrumbs
<AppLayout 
  appName="Ghostwriter" 
  appIcon={FiFileText} 
  variant="app"
  breadcrumbs={breadcrumbs}
>
  <YourPageContent />
</AppLayout>

// Dynamic breadcrumb generation in layout
const getBreadcrumbs = () => {
  const breadcrumbs = [
    { label: 'Home', href: '/home', icon: FiHome },
    { label: 'Ghostwriter', href: '/ghostwriter', icon: FiFileText, isActive: pathname === '/ghostwriter' },
  ];
  
  if (pathname === '/ghostwriter/drafts') {
    breadcrumbs.push({
      label: 'Drafts',
      href: '/ghostwriter/drafts', 
      icon: FiEdit3,
      isActive: true,
    });
  }
  
  return breadcrumbs;
};
```

### Key Components

**AppLayout** - Main wrapper for all protected pages
- Provides consistent header/footer
- Handles navigation loading
- Manages global layout structure
- **Fixed viewport**: No scrolling at layout level - components must handle their own scrolling

**AppHeader** - Application header component
- Displays seamless navigation with consistent visual design
- HomeIcon component: identical 14px icon in 32px container across all contexts
- Breadcrumb navigation: hierarchical with visual state indicators
- Layout variants: 'home' (icon only) vs 'app' (breadcrumbs/app name)
- Consistent styling: all elements use 32px height, px={2} py={1} padding
- Color coding: teal (clickable), white/gray (current page), subdued arrows

**AuthGuard** - Route protection wrapper
- Ensures user authentication
- Handles redirects
- Integrates with loading system

## Styling & Theming

### Theme System

The application uses a centralized theme system built on Chakra UI:

**Theme Provider** (`src/components/theme/ThemeProvider.tsx`)
- Forces dark mode only
- Provides Chakra UI + Saas UI themes
- Applies global color scheme

**Color Palette** (`src/components/theme/colors.ts`)
```typescript
// Brand colors (teal/seagreen)
brand: {
  500: '#14b8a6', // Primary
  400: '#2dd4bf', // Lighter
  600: '#0d9488', // Darker
}

// Extended gray scale
gray: {
  800: '#262626', // Card backgrounds
  900: '#171717', // App background
  700: '#404040', // Borders
  100: '#f5f5f5', // Primary text
}
```

**Usage Patterns:**
```tsx
// Direct color usage
<Box bg="gray.800" color="gray.100" borderColor="gray.700">

// Theme utilities
import { useTheme, colorCombinations } from '@/components/theme';
const { getBrandColor } = useTheme();

// Color combinations
<Box {...colorCombinations.surface.primary}>
```

### Component Styling

**Default Overrides** (`src/components/theme/theme.ts`)
- All buttons default to `brand` colorScheme
- Form elements use dark backgrounds
- Consistent focus/hover states

**Global Styles** (`src/app/globals.css`)
- CSS custom properties for all colors
- Chakra UI variable mappings
- Scrollbar styling
- Code syntax highlighting

### Responsive Design

**Minimum Requirements** (`src/app/responsive.css`)
- 800px minimum width
- 500px minimum height
- Shows warning message below minimum

**Usage:**
```tsx
// Chakra responsive props
<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
<Box display={{ base: 'none', md: 'block' }}>
```

## Database & Backend

### Supabase Configuration

**Client Setup** (`src/lib/supabase/client.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**Type Generation**
```bash
# Generate TypeScript types from database
npm run db:generate-types
# Types saved to src/lib/supabase/types.ts
```

### Data Access Patterns

**Real-time Subscriptions:**
```typescript
// Subscribe to data changes
useEffect(() => {
  const subscription = supabase
    .channel('table_changes')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'your_table' },
      handleNewData
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

**CRUD Operations:**
```typescript
// Create
const { data, error } = await supabase
  .from('table')
  .insert({ ...data });

// Read
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('user_id', userId);

// Update
const { data, error } = await supabase
  .from('table')
  .update({ ...updates })
  .eq('id', id);

// Delete
const { error } = await supabase
  .from('table')
  .delete()
  .eq('id', id);
```

## Authentication System

### Auth Flow

1. **Supabase Auth** - Handles authentication
2. **AuthProvider** - Manages global auth state
3. **AuthGuard** - Protects routes
4. **Session Management** - Automatic token refresh

### Usage Patterns

**Protecting Routes:**
```tsx
export default function ProtectedPage() {
  return (
    <AuthGuard>
      <PageContent />
    </AuthGuard>
  );
}
```

**Auth Hook:**
```tsx
import { useAuth } from '@saas-ui/auth';

function Component() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <LoginPrompt />;
  
  return <AuthenticatedContent user={user} />;
}
```

**Login/Logout:**
```tsx
import { useLogin, useLogout } from '@saas-ui/auth';

function AuthButtons() {
  const [{ isLoading }, login] = useLogin();
  const logout = useLogout();
  
  return (
    <>
      <Button onClick={() => login({ email, password })} isLoading={isLoading}>
        Login
      </Button>
      <Button onClick={logout}>Logout</Button>
    </>
  );
}
```

## Development Patterns

### Code Organization

**1. Feature-First Structure**
```
src/app/feature/
├── layout.tsx          # Feature layout
├── page.tsx           # Main feature page
├── components/        # Feature components
└── [dynamic]/         # Dynamic routes
```

**2. Hook Patterns**
```typescript
// Custom hooks in src/hooks/
export function useFeature() {
  const [state, setState] = useState();
  const [loading, setLoading] = useState(false);
  
  const someAction = useCallback(async () => {
    setLoading(true);
    try {
      // Action logic
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { state, loading, someAction };
}
```

**3. Component Patterns**
```typescript
// Consistent component structure
interface ComponentProps {
  // Props interface
}

export function Component({ ...props }: ComponentProps) {
  // Hooks at top
  // Handlers
  // Early returns
  // Main render
}

// Always export as named export for consistency
```

**4. Layout & Scrolling Pattern**
```typescript
// LAYOUT LEVEL: AppLayout in layout.tsx with dynamic breadcrumbs
export default function FeatureLayout({ children }) {
  const pathname = usePathname();
  
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Home', href: '/home', icon: FiHome }, // Shows as icon only
      { label: 'App', href: '/app', icon: FiGrid, isActive: pathname === '/app' },
    ];
    
    // Add dynamic breadcrumbs based on pathname  
    if (pathname === '/app/subpage') {
      breadcrumbs.push({
        label: 'Sub Page',
        href: '/app/subpage',
        icon: FiEdit,
        isActive: true, // Gray, non-clickable
      });
    }
    
    return breadcrumbs;
  };

  return (
    <AppLayout 
      appName="App" 
      appIcon={FiGrid} 
      variant="app"
      breadcrumbs={getBreadcrumbs()}
    >
      {children}
    </AppLayout>
  );
}

// PAGE LEVEL: Just content, no AppLayout (prevents flickering)
export default function Page() {
  return (
    <AuthGuard>
      <Box h="100%" overflow="auto" p={8}>
        {/* Page content - will scroll if needed */}
        <VStack spacing={6} align="stretch">
          <PageContent />
        </VStack>
      </Box>
    </AuthGuard>
  );
}

// For nested scrollable areas
<Box h="300px" overflow="auto" border="1px solid" borderColor="gray.700">
  <List />
</Box>
```

### Error Handling

**1. API Errors**
```typescript
try {
  const { data, error } = await supabase.from('table').select();
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Error:', error);
  toast({
    title: 'Error occurred',
    description: error.message,
    status: 'error',
  });
}
```

**2. Component Error Boundaries**
```typescript
// Use React Error Boundaries for component errors
function ErrorFallback({ error }: { error: Error }) {
  return (
    <Box p={6} textAlign="center">
      <Text color="red.400">Something went wrong</Text>
      <Button onClick={() => window.location.reload()}>
        Reload Page
      </Button>
    </Box>
  );
}
```

### Performance Patterns

**1. Memoization**
```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Memoize callback functions
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

**2. Component Optimization**
```typescript
// Memoize components that receive stable props
export const Component = React.memo(function Component({ prop }) {
  return <div>{prop}</div>;
});
```

**3. Loading States**
```typescript
// Show loading immediately, no delays
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchData().finally(() => setLoading(false));
}, []);
```

## Build & Deployment

### Build Process

**Development Build:**
```bash
npm run dev
# - Hot reloading
# - Source maps
# - Fast refresh
# - Development optimizations
```

**Production Build:**
```bash
npm run build
# - Static optimization
# - Bundle analysis
# - Performance optimizations
# - Asset compression
```

### Environment Configuration

**Development** (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=your_dev_supabase_url
OPENROUTER_API_KEY=your_dev_openrouter_key
```

**Production** (Platform environment variables)
```env
NEXT_PUBLIC_SUPABASE_URL=your_prod_supabase_url
OPENROUTER_API_KEY=your_prod_openrouter_key
```

### Deployment

**Vercel Deployment:**
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

**Manual Deployment:**
```bash
npm run build
npm run start
```

### Performance Monitoring

**Built-in Analytics:**
- Next.js built-in analytics
- Vercel Analytics (if deployed on Vercel)
- Core Web Vitals tracking

## Testing Strategy

### Current Testing Setup

The project currently focuses on:
1. **TypeScript Compilation** - Ensures type safety
2. **ESLint** - Code quality and consistency
3. **Manual Testing** - UI and functionality testing

### Adding Tests (Recommended)

**Unit Testing:**
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Test component
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

test('renders component', () => {
  render(<Component />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

**Integration Testing:**
```typescript
// Test hooks
import { renderHook } from '@testing-library/react';
import { useCustomHook } from './useCustomHook';

test('custom hook works', () => {
  const { result } = renderHook(() => useCustomHook());
  expect(result.current.value).toBe(expectedValue);
});
```

### Quality Assurance

**Code Quality:**
```bash
npm run lint        # ESLint checks
npm run type-check  # TypeScript checks
npm run format      # Prettier formatting
```

**Manual Testing Checklist:**
- [ ] Authentication flow works
- [ ] Navigation loading is smooth
- [ ] Responsive design works
- [ ] Error states are handled
- [ ] All features work correctly

## Navigation System Details

### Header Design Philosophy

The AppHeader implements a seamless navigation system with these key principles:

**Visual Continuity**
- Navigation transitions only add/remove elements, never change existing ones
- Home icon appears identically in all contexts (size, spacing, positioning)
- Consistent 32px height and balanced padding across all elements

**HomeIcon Component**
```tsx
// Shared component ensures identical appearance everywhere
function HomeIcon({ isClickable = false, href = '/home' }) {
  const baseProps = {
    variant: "ghost",
    icon: <FiHome size={14} />,
    "aria-label": "Navigate to main page",
    minW: "32px",
    h: "32px", 
    px: 2,
    py: 1,
  };
  
  return (
    <IconButton
      {...baseProps}
      color={isClickable ? "teal.400" : "white"}
      // ... hover and link props
    />
  );
}
```

**Breadcrumb System**
- **Home**: Always renders as HomeIcon (icon only, no text)
- **Intermediate levels**: Clickable with teal color and hover effects
- **Current page**: Gray color, non-clickable appearance
- **Arrows**: Subdued gray (#9CA3AF) for visual hierarchy

**Layout Variants**
- `variant="home"`: Shows only HomeIcon in white (non-clickable)
- `variant="app"`: Shows breadcrumbs or app name with consistent styling
- Automatic height consistency prevents layout shifts

### Implementation Pattern

```tsx
// In feature layouts - generate dynamic breadcrumbs
export default function FeatureLayout({ children }) {
  const pathname = usePathname();
  
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Home', href: '/home', icon: FiHome },
      { label: 'Feature', href: '/feature', icon: FeatureIcon, isActive: pathname === '/feature' },
    ];
    
    // Add sub-navigation based on pathname
    if (pathname.includes('/feature/sub')) {
      breadcrumbs.push({
        label: 'Sub Page',
        href: pathname,
        icon: SubIcon,
        isActive: true,
      });
    }
    
    return breadcrumbs;
  };

  return (
    <AppLayout 
      appName="Feature" 
      appIcon={FeatureIcon}
      variant="app"
      breadcrumbs={getBreadcrumbs()}
    >
      {children}
    </AppLayout>
  );
}
```

## Contributing Guidelines

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow Code Standards**
   - Use TypeScript strict mode
   - Follow existing component patterns
   - Add proper error handling
   - Use consistent naming conventions

3. **Test Your Changes**
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: descriptive commit message"
   ```

5. **Create Pull Request**
   - Describe changes clearly
   - Include screenshots for UI changes
   - Test in different browsers

### Code Standards

**TypeScript:**
- Use strict mode
- Define proper interfaces
- Avoid `any` type
- Use generic types when appropriate

**React:**
- Use functional components
- Use hooks for state management
- Memoize when beneficial
- Handle loading and error states

**Styling:**
- Use Chakra UI components
- Follow theme conventions
- Use responsive design patterns
- Maintain dark mode consistency

**File Organization:**
- Feature-specific components in feature directories
- Shared components in global components directory
- Use consistent file naming (PascalCase for components)
- Export components as named exports

### Adding New Features

**1. Plan the Feature**
- Identify required components
- Plan data flow
- Consider authentication requirements
- Design error handling

**2. Create Directory Structure**
```
src/app/new-feature/
├── layout.tsx
├── page.tsx
├── components/
│   ├── FeatureComponent.tsx
│   └── index.ts
└── hooks/
    └── useFeature.ts
```

**3. Implement Components**
- Start with layout and main page
- Add feature-specific components
- Implement hooks for data management
- Add proper TypeScript types

**4. Integration**
- Add navigation links to home page
- Test with existing features
- Ensure consistent styling
- Handle error states


This documentation covers the general architecture and development patterns of Aiwah Infinity. For feature-specific implementation details, refer to the dedicated documentation files for each sub-application. 