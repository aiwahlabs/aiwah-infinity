# Typography System

This application uses a standardized typography system with readable, compact font sizes that balance clarity with clean layouts.

## Text Styles

Use these predefined text styles instead of manually setting font sizes:

### Headings

```tsx
// Page titles (20px) - clear and readable
<Heading textStyle="page-title">Main Page Title</Heading>

// Section headings (18px) - prominent section titles
<Heading textStyle="section-heading">Section Title</Heading>

// Card titles (16px) - readable card titles
<Heading textStyle="card-title">Card Title</Heading>
```

### Body Text

```tsx
// Regular body text (14px) - comfortable reading size
<Text textStyle="body">Regular content text</Text>

// Small text/captions (12px) - supplementary text
<Text textStyle="caption">Small text, help text, captions</Text>
```

### Chakra UI Heading Sizes

You can also use Chakra's size prop, which now uses readable sizes:

```tsx
<Heading size="xs">12px heading</Heading>
<Heading size="sm">14px heading</Heading>
<Heading size="md">16px heading</Heading>
<Heading size="lg">18px heading</Heading>
<Heading size="xl">20px heading</Heading>
<Heading size="2xl">24px heading</Heading>
```

## Font Sizes

Direct font sizes are available if needed:

- `xs`: 12px (small text)
- `sm`: 14px (default text)
- `md`: 16px (base size)
- `lg`: 18px (slightly larger)
- `xl`: 20px (headings)
- `2xl`: 24px (large headings)
- `3xl`: 30px (very large)
- `4xl`: 36px
- `5xl`: 44px
- `6xl`: 56px

## Best Practices

1. **Use text styles first**: Always prefer `textStyle` props over manual `fontSize` settings
2. **Page titles**: Use `textStyle="page-title"` for main page headings (20px)
3. **Section headings**: Use `textStyle="section-heading"` for sub-sections (18px)
4. **Body text**: Use `textStyle="body"` for regular content (14px)
5. **Readable design**: These sizes create clear, comfortable reading experiences
6. **Icons**: Use consistent icon sizes (`boxSize={4}` to `boxSize={6}`)

## Examples

```tsx
// Good - uses readable, standardized typography
<VStack align="start" spacing={2}>
  <HStack>
    <Icon as={FiFileText} color="blue.400" boxSize={5} />
    <Heading textStyle="page-title">Documents</Heading>
  </HStack>
  <Text textStyle="body">Manage your content library</Text>
</VStack>

// Avoid - inconsistent sizing
<VStack align="start" spacing={1}>
  <HStack>
    <Icon as={FiFileText} color="blue.400" boxSize={8} />
    <Heading size="2xl">Documents</Heading>
  </HStack>
  <Text fontSize="lg">Manage your content library</Text>
</VStack>
``` 