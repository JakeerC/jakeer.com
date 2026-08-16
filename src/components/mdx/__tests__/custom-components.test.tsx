import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Callout, SparkyText, MoreInfo, SwirlyUnderline, HighlightText } from '../index';

describe('MDX Custom Components', () => {
  describe('Callout', () => {
    it('renders with default info type', () => {
      render(<Callout>Hello world</Callout>);
      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('renders with title', () => {
      render(<Callout title="Important Note">Hello world</Callout>);
      expect(screen.getByText('Important Note')).toBeInTheDocument();
      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });
  });

  describe('SparkyText', () => {
    it('renders children correctly', () => {
      render(<SparkyText>Sparkling</SparkyText>);
      expect(screen.getByText('Sparkling')).toBeInTheDocument();
    });
  });

  describe('MoreInfo', () => {
    it('renders children and tooltip info', () => {
      render(<MoreInfo info="Extra details">Hover me</MoreInfo>);
      expect(screen.getByText('Hover me')).toBeInTheDocument();
      
      // The asterisk button should be present
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      
      // Simulate hover to show the tooltip
      fireEvent.mouseEnter(button);
      
      // The tooltip text should now be visible
      expect(screen.getByText('Extra details')).toBeInTheDocument();
    });
  });

  describe('SwirlyUnderline', () => {
    it('renders children', () => {
      render(<SwirlyUnderline>Underlined text</SwirlyUnderline>);
      expect(screen.getByText('Underlined text')).toBeInTheDocument();
    });
  });

  describe('HighlightText', () => {
    it('renders children', () => {
      render(<HighlightText>Highlighted text</HighlightText>);
      expect(screen.getByText('Highlighted text')).toBeInTheDocument();
    });
  });
});
