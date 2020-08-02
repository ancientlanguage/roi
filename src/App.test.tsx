import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders shark', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Shark/i);
  expect(linkElement).toBeInTheDocument();
});
