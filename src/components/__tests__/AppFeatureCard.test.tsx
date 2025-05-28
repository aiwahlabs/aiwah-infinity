// src/components/__tests__/AppFeatureCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppFeatureCard } from '../AppFeatureCard'; // Adjust path if needed
import { FiAnchor } from 'react-icons/fi'; // A placeholder icon

describe('AppFeatureCard', () => {
  const defaultProps = {
    href: '/test-link',
    icon: FiAnchor,
    title: 'Test Title',
    description: 'Test Description',
  };

  it('renders the title and description', () => {
    render(<AppFeatureCard {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders a link with the correct href', () => {
    render(<AppFeatureCard {...defaultProps} />);
    // The link itself wraps the card, so check an element within it or the role.
    // Check if the card content (e.g., title) is within a link structure.
    // Next/link makes the Card itself the anchor if `passHref` and `style={{ display: 'contents' }}` are used.
    // A simpler check might be to ensure the interactive element (Card) is present.
    // Or, more robustly, check for an ancestor link.
    expect(screen.getByText('Test Title').closest('a')).toHaveAttribute('href', '/test-link');
  });
});
