import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScoreGauge from '../components/ScoreGauge';

describe('ScoreGauge Component', () => {
  it('renders overall score, grade, and verdict correctly', () => {
    render(
      <ScoreGauge
        score={88}
        grade="A"
        verdict="Recruiter Ready"
        verdictColor="emerald"
      />
    );

    expect(screen.getByText('88')).toBeDefined();
    expect(screen.getByText('/100')).toBeDefined();
    expect(screen.getByText('Grade A')).toBeDefined();
    expect(screen.getByText('Recruiter Ready')).toBeDefined();
  });

  it('renders amber status for medium score', () => {
    render(
      <ScoreGauge
        score={65}
        grade="C"
        verdict="Needs Immediate Rescue"
        verdictColor="amber"
      />
    );

    expect(screen.getByText('65')).toBeDefined();
    expect(screen.getByText('Grade C')).toBeDefined();
    expect(screen.getByText('Needs Immediate Rescue')).toBeDefined();
  });
});
