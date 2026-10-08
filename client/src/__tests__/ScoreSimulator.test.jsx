import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScoreSimulator from '../components/ScoreSimulator';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('ScoreSimulator Component', () => {
  const mockRescuePlan = {
    currentScore: 65,
    potentialGain: 20,
    simulatedScore: 85,
  };

  it('renders initial score and simulated improvement', () => {
    render(<ScoreSimulator currentScore={65} rescuePlan={mockRescuePlan} />);

    expect(screen.getByText('Current')).toBeDefined();
    expect(screen.getByText('65')).toBeDefined();
    expect(screen.getByText('Simulated')).toBeDefined();
  });

  it('toggles checkbox and recalculates score improvement', () => {
    render(<ScoreSimulator currentScore={65} rescuePlan={mockRescuePlan} />);

    // Click an unchecked task to toggle it
    const docsTask = screen.getByText(/Write structured READMEs with setup instructions for top 3 projects/);
    fireEvent.click(docsTask);

    // The point gain badge updates
    expect(screen.getByText(/\+17 pts/)).toBeDefined();
  });
});
