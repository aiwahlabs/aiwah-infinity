# Typography System

This application uses a standardized typography system with very small, conservative font sizes to ensure clean, compact layouts.

## Text Styles

Use these predefined text styles instead of manually setting font sizes:

### Headings

```tsx
// Page titles (16px) - small and clean
<Heading textStyle="page-title">Main Page Title</Heading>

// Section headings (14px) - compact section titles
<Heading textStyle="section-heading">Section Title</Heading>

// Card titles (12px) - very small card titles
<Heading textStyle="card-title">Card Title</Heading>
```

### Body Text

```tsx
// Regular body text (11px) - compact reading size
<Text textStyle="body">Regular content text</Text>

// Small text/captions (10px) - tiny supplementary text
<Text textStyle="caption">Small text, help text, captions</Text>
```

### Chakra UI Heading Sizes

You can also use Chakra's size prop, which now uses very conservative sizes:

```tsx
<Heading size="xs">11px heading</Heading>
<Heading size="sm">12px heading</Heading>
<Heading size="md">14px heading</Heading>
<Heading size="lg">16px heading</Heading>
<Heading size="xl">18px heading</Heading>
<Heading size="2xl">20px heading</Heading>
```

## Font Sizes

Direct font sizes are available if needed:

- `xs`: 11px (default text)
- `sm`: 12px (small text)
- `md`: 14px (base size)
- `lg`: 16px (slightly larger)
- `xl`: 18px (headings)
- `2xl`: 20px (large headings)
- `3xl`: 24px (very large)
- `4xl`: 30px
- `5xl`: 36px
- `6xl`: 48px

## Best Practices

1. **Use text styles first**: Always prefer `textStyle` props over manual `fontSize` settings
2. **Page titles**: Use `textStyle="page-title"` for main page headings (16px)
3. **Section headings**: Use `textStyle="section-heading"` for sub-sections (14px)
4. **Body text**: Use `textStyle="body"` for regular content (11px)
5. **Compact design**: These small sizes create clean, information-dense layouts
6. **Icons**: Use consistent small icon sizes (`boxSize={4}` or `boxSize={5}`)

## Examples

```tsx
// Good - uses very small, standardized typography
<VStack align="start" spacing={1}>
  <HStack>
    <Icon as={FiFileText} color="blue.400" boxSize={4} />
    <Heading textStyle="page-title">Documents</Heading>
  </HStack>
  <Text textStyle="body">Manage your content library</Text>
</VStack>

// Avoid - larger, inconsistent sizing
<VStack align="start" spacing={1}>
  <HStack>
    <Icon as={FiFileText} color="blue.400" boxSize={6} />
    <Heading size="lg">Documents</Heading>
  </HStack>
  <Text fontSize="md">Manage your content library</Text>
</VStack>
``` 