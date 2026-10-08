import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RoastCard from '../components/RoastCard';

describe('RoastCard Component', () => {
  const mockRoast = {
    title: 'TODO Since 2023',
    text: "Your README.md is shorter than a goldfish's attention span—it literally just says 'TODO' from 2023.",
    additionalRoasts: [
      {
        title: 'The Shah Rukh Khan Diagnosis',
        text: "Even Shah Rukh Khan in My Name is Khan couldn't diagnose the state of your dependency tree.",
      },
      {
        title: 'The Karan Johar Merge Conflict',
        text: 'Your branches are messier than a family drama directed by Karan Johar, and twice as dramatic when they merge.',
      },
    ],
  };

  it('renders initial roast title and text', () => {
    render(<RoastCard roast={mockRoast} username="johndoe" />);

    expect(screen.getByText('TODO Since 2023')).toBeDefined();
    expect(
      screen.getByText(
        /"Your README\.md is shorter than a goldfish's attention span—it literally just says 'TODO' from 2023\."/
      )
    ).toBeDefined();
    expect(screen.getByText('Roast 1 of 3')).toBeDefined();
  });

  it('cycles to next savage roast when Reroll Roast is clicked', () => {
    render(<RoastCard roast={mockRoast} username="johndoe" />);

    const rerollButton = screen.getByText('Reroll Roast');
    fireEvent.click(rerollButton);

    // Should now show the second roast
    expect(screen.getByText('The Shah Rukh Khan Diagnosis')).toBeDefined();
    expect(
      screen.getByText(
        /"Even Shah Rukh Khan in My Name is Khan couldn't diagnose the state of your dependency tree\."/
      )
    ).toBeDefined();
    expect(screen.getByText('Roast 2 of 3')).toBeDefined();
  });
});
