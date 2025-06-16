import { render, screen } from '@testing-library/react';
import Component from '../Component';

describe('Component', () => {
  it('renders greeting', () => {
    render(<Component />);
    expect(screen.getByText('Hello component!')).toBeInTheDocument();
  });
});
