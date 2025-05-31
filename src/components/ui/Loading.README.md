# Centralized Loading System

A comprehensive, extensible loading system that provides consistent loading states throughout the application. Built with the centralized theme system for perfect visual consistency.

## Overview

The Loading system provides:
- **Multiple variants** - Full screen, page, card, inline, button, modal, widget
- **Customizable backgrounds** - Solid, blur, dark, transparent, none
- **Theme integration** - Uses centralized color system
- **High performance** - Optimized for smooth animations
- **Accessibility** - Proper loading states and screen reader support
- **Type safety** - Full TypeScript support

## Quick Start

```tsx
import { PageLoading, CardLoading, useLoading } from '@/components/ui';

// Simple page loading
<PageLoading message="Loading content..." />

// Card overlay loading
<CardLoading isLoading={isLoading} message="Fetching data..." />

// Using the hook
const { isLoading, startLoading, stopLoading } = useLoading();
```

## Components

### Core Loading Component

```tsx
<Loading 
  variant="page"          // Loading type
  background="solid"      // Background style  
  message="Loading..."    // Loading message
  size="md"              // Spinner size
  isLoading={true}       // Show/hide loading
/>
```

### Convenience Components

```tsx
// Full screen overlay (uses Portal)
<FullScreenLoading message="Processing..." />

// Page content loading
<PageLoading message="Loading page..." />

// Card/container overlay
<CardLoading isLoading={loading} />

// Inline content loading
<InlineLoading size="sm" />

// Button loading state
<ButtonLoading isLoading={submitting} />

// Modal overlay
<ModalLoading message="Saving..." />

// Widget/component loading
<WidgetLoading size="sm" />
```

## Variants

### `fullscreen`
- **Position**: Fixed, covers entire viewport
- **Z-index**: 9999
- **Portal**: Yes (renders outside normal DOM flow)
- **Use case**: App-wide operations, authentication checks

```tsx
<FullScreenLoading 
  message="Authenticating..."
  size="lg"
/>
```

### `page`
- **Position**: Absolute, covers container
- **Z-index**: 10
- **Use case**: Page content loading, route transitions

```tsx
<PageLoading 
  message="Loading dashboard..."
  minHeight="60vh"
/>
```

### `card`
- **Position**: Absolute, covers parent container
- **Z-index**: 5
- **Border radius**: Matches container
- **Use case**: Component overlays, data fetching

```tsx
<CardLoading 
  isLoading={isLoading}
  message="Fetching data..."
  background="solid"
/>
```

### `inline`
- **Position**: Relative
- **Background**: None (default)
- **Use case**: Inline content replacement

```tsx
<InlineLoading 
  message="Processing..."
  size="sm"
/>
```

### `button`
- **Position**: Relative  
- **Size**: Extra small
- **Background**: None
- **Message**: Hidden by default
- **Use case**: Button loading states

```tsx
<ButtonLoading isLoading={submitting} />
```

### `modal`
- **Position**: Absolute
- **Background**: Dark semi-transparent
- **Use case**: Modal/dialog overlays

```tsx
<ModalLoading message="Saving changes..." />
```

### `widget`
- **Position**: Absolute
- **Size**: Small
- **Use case**: Small components, widgets

```tsx
<WidgetLoading message="Loading widget..." />
```

## Background Styles

### `solid` (Default)
- **Style**: Solid gray background with 95% opacity
- **Performance**: Best
- **Use case**: General purpose, preferred option

```tsx
<Loading background="solid" />
```

### `blur`
- **Style**: Semi-transparent with backdrop blur
- **Performance**: Good (disable for better performance)
- **Use case**: When content visibility is desired

```tsx
<Loading background="blur" disableBlur={false} />
```

### `dark`
- **Style**: Dark semi-transparent (85% opacity)
- **Use case**: Over light content

```tsx
<Loading background="dark" />
```

### `transparent`
- **Style**: Transparent background
- **Use case**: Minimal visual impact

```tsx
<Loading background="transparent" />
```

### `none`
- **Style**: No background
- **Use case**: Inline content, minimal overlays

```tsx
<Loading background="none" />
```

## Sizes

- **`xs`**: Extra small spinner, small text
- **`sm`**: Small spinner, small text  
- **`md`**: Medium spinner, medium text (default)
- **`lg`**: Large spinner, large text
- **`xl`**: Extra large spinner, extra large text

## Hooks

### `useLoading()`

Programmatic loading state management:

```tsx
function MyComponent() {
  const { 
    isLoading, 
    startLoading, 
    stopLoading, 
    toggleLoading,
    setIsLoading 
  } = useLoading();
  
  const handleAction = async () => {
    startLoading();
    try {
      await someAsyncOperation();
    } finally {
      stopLoading();
    }
  };
  
  return (
    <Box position="relative">
      <Button onClick={handleAction}>Do Something</Button>
      <Loading variant="card" isLoading={isLoading} />
    </Box>
  );
}
```

## Higher-Order Component

Wrap existing components with loading functionality:

```tsx
const MyCard = ({ children }) => (
  <Card>
    <CardBody>{children}</CardBody>
  </Card>
);

const LoadingCard = withLoading(MyCard, {
  message: "Loading card...",
  background: "solid"
});

// Usage
<LoadingCard isLoading={isLoading}>
  <Text>Card content</Text>
</LoadingCard>
```

## Advanced Configuration

### Custom Spinner Props

```tsx
<Loading
  spinnerProps={{
    size: 'xl',
    color: 'purple.500',
    thickness: '4px',
    speed: '0.6s',
  }}
/>
```

### Custom Text Props

```tsx
<Loading
  textProps={{
    color: 'brand.300',
    fontSize: 'lg',
    fontWeight: 'bold',
  }}
/>
```

### Custom Container Props

```tsx
<Loading
  containerProps={{
    bg: 'custom.bg',
    borderRadius: 'xl',
    p: 4,
  }}
/>
```

### Custom Overlay Opacity

```tsx
<Loading
  background="dark"
  overlayOpacity={0.7}
/>
```

### Portal Control

```tsx
<Loading
  variant="fullscreen"
  usePortal={false}  // Render in normal DOM flow
/>
```

## Best Practices

### 1. Choose the Right Variant
- **FullScreen**: App-wide operations, authentication
- **Page**: Route changes, major content loading
- **Card**: Component-level data fetching
- **Inline**: Content replacement
- **Widget**: Small component loading

### 2. Use Appropriate Background
- **Solid**: Default choice, best performance
- **Blur**: When content visibility matters
- **None**: Minimal visual impact

### 3. Meaningful Messages
```tsx
// ✅ Good
<Loading message="Saving your document..." />
<Loading message="Fetching latest data..." />

// ❌ Avoid
<Loading message="Loading..." />
<Loading message="Please wait..." />
```

### 4. Consistent Sizing
```tsx
// ✅ Match component context
<InlineLoading size="sm" />    // In small components
<PageLoading size="lg" />      // For major page loading
```

### 5. Proper Error Handling
```tsx
const { isLoading, startLoading, stopLoading } = useLoading();

const handleAction = async () => {
  startLoading();
  try {
    await riskyOperation();
  } catch (error) {
    // Handle error
  } finally {
    stopLoading(); // Always stop loading
  }
};
```

## Performance Considerations

### 1. Disable Blur for Better Performance
```tsx
<Loading background="blur" disableBlur={true} />
```

### 2. Use Portal Wisely
- Portals are created for `fullscreen` variant automatically
- Avoid unnecessary portals for better performance

### 3. Conditional Rendering
```tsx
// ✅ Good - only renders when needed
<Loading isLoading={isLoading} />

// ❌ Avoid - always in DOM
<Loading isLoading={isLoading} style={{ display: isLoading ? 'flex' : 'none' }} />
```

## Migration from Old Loading States

### Before
```tsx
// Old custom loading
{loading && (
  <Center h="100%">
    <VStack>
      <Spinner size="xl" color="teal.500" />
      <Text>Loading...</Text>
    </VStack>
  </Center>
)}
```

### After
```tsx
// New centralized loading
<PageLoading 
  isLoading={loading}
  message="Loading content..."
  size="lg"
/>
```

## Examples

See `Loading.example.tsx` for comprehensive usage examples including:
- Basic variant usage
- Background style demonstrations
- Hook usage patterns
- HOC examples
- Custom configurations
- Real-world scenarios

## Theme Integration

The Loading system automatically uses:
- **Brand colors** for spinners (`brand.500`)
- **Gray colors** for text and backgrounds
- **Consistent spacing** from theme
- **Proper contrast** for accessibility

Colors can be customized:
```tsx
<Loading 
  color="purple.500"          // Custom spinner color
  textProps={{ color: 'purple.300' }}  // Custom text color
/>
``` 