# Centralized Theme System

This directory contains the centralized theme configuration for the entire application, based on Saas UI recommendations and the chat design system.

## Overview

The theme system provides:
- **Consistent dark mode only** - No light mode support
- **Teal/seagreen brand colors** - Based on the chat interface theme
- **Enhanced gray scale** - Better contrast and readability
- **Saas UI integration** - Built on top of Saas UI theme foundations
- **Type safety** - Full TypeScript support

## Files

### `theme.ts`
Main theme configuration that extends Chakra UI and Saas UI themes.

```ts
import { theme } from '@/components/theme';
```

### `colors.ts`
Color palette definitions and exports.

```ts
import { colors, brandColors, grayColors } from '@/components/theme';
```

### `utils.ts`
Theme utility functions and helpers.

```ts
import { useTheme, colorCombinations, getFocusStyles } from '@/components/theme';
```

### `ThemeProvider.tsx`
Provider component that applies the theme globally.

## Usage

### Basic Color Usage

```tsx
import { Box } from '@chakra-ui/react';

// Using theme colors
<Box bg="gray.800" color="gray.100">
  Content with theme colors
</Box>

// Using brand colors
<Button colorScheme="brand">
  Primary Button
</Button>
```

### Using Theme Hook

```tsx
import { useTheme } from '@/components/theme';

function MyComponent() {
  const { getBrandColor, getGrayColor } = useTheme();
  
  return (
    <Box bg={getGrayColor(800)} borderColor={getBrandColor(600)}>
      Content
    </Box>
  );
}
```

### Using Color Combinations

```tsx
import { colorCombinations } from '@/components/theme';

function MyCard() {
  return (
    <Box {...colorCombinations.surface.primary}>
      Card content with consistent surface styling
    </Box>
  );
}
```

### Focus and Hover Styles

```tsx
import { getFocusStyles, getHoverStyles } from '@/components/theme';

function MyInput() {
  return (
    <Input
      _focus={getFocusStyles()}
      _hover={getHoverStyles('#14b8a6', 'medium')}
    />
  );
}
```

## Color Palette

### Brand Colors (Teal/Seagreen)
- `brand.50` - `#f0fdfa` - Lightest teal
- `brand.500` - `#14b8a6` - Primary brand color
- `brand.900` - `#134e4a` - Darkest teal

### Gray Scale
- `gray.50` - `#fafafa` - Light text
- `gray.100` - `#f5f5f5` - Primary text color
- `gray.500` - `#737373` - Muted text
- `gray.700` - `#404040` - Border color
- `gray.800` - `#262626` - Card/surface background
- `gray.900` - `#171717` - Main app background

### Semantic Colors
- `success.*` - Green variants for success states
- `warning.*` - Orange variants for warning states  
- `error.*` - Red variants for error states
- `info.*` - Blue variants for info states

## Component Defaults

All components are configured with dark mode defaults:

### Buttons
- Default colorScheme: `brand`
- Focus styles: No box-shadow
- Hover states: Appropriate darkening

### Form Elements
- Background: `gray.800`
- Border: `gray.600`
- Focus border: `brand.500`
- Focus shadow: Teal outline

### Cards
- Background: `gray.800`
- Border: `gray.700`
- Color: `gray.100`

### Modals & Overlays
- Background: `gray.800`
- Overlay: Semi-transparent with blur

## Customization

### Adding New Colors

```ts
// In colors.ts
export const colors = {
  // ... existing colors
  custom: {
    500: '#your-color',
    // ... other shades
  },
} as const;
```

### Overriding Component Styles

```ts
// In theme.ts
const components = {
  // ... existing components
  YourComponent: {
    baseStyle: {
      // Your custom styles
    },
  },
};
```

## Migration from Old Theme

The new theme maintains backward compatibility:

- All `teal.*` colors map to `brand.*` colors
- Existing `gray.*` references continue to work
- Component props remain the same

## Best Practices

1. **Use semantic colors** for consistent meaning
2. **Leverage colorCombinations** for complex styling
3. **Use theme utilities** instead of hardcoded colors
4. **Test contrast** - All combinations meet accessibility standards
5. **Stay consistent** - Use the same patterns across components

## Examples

### Creating a Themed Component

```tsx
import { Box, Button, Text } from '@chakra-ui/react';
import { colorCombinations } from '@/components/theme';

export function ThemedCard({ children }) {
  return (
    <Box {...colorCombinations.surface.primary} p={6} borderRadius="lg">
      <Text color={colorCombinations.text.primary} mb={4}>
        Card Title
      </Text>
      {children}
      <Button colorScheme="brand" mt={4}>
        Action Button
      </Button>
    </Box>
  );
}
```

### Using Custom Focus Styles

```tsx
import { Input } from '@chakra-ui/react';
import { getFocusStyles } from '@/components/theme';

export function ThemedInput(props) {
  return (
    <Input
      bg="gray.800"
      borderColor="gray.600"
      _focus={getFocusStyles()}
      {...props}
    />
  );
}
``` 