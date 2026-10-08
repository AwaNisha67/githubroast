import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RecruiterView from '../components/RecruiterView';

describe('RecruiterView Component', () => {
  const mockRecruiterView = {
    verdict: 'Technically capable, but portfolio presentation is holding them back.',
    quick_take: 'Solid multi-stack fundamentals, but uncurated repositories slow down screening.',
    strengths: [
      'Healthy project volume across Python and React',
      'Consistent contributions in the last 14 days',
    ],
    red_flags: [
      'Missing profile README header',
      '8 repositories lack one-sentence descriptions',
    ],
    hiring_manager_quote: '"The code is there, but clean up the showcase before the technical round."',
  };

  it('renders verdict, hiring manager quote, strengths, and red flags', () => {
    render(<RecruiterView recruiterView={mockRecruiterView} />);

    expect(
      screen.getByText(/Verdict: Technically capable, but portfolio presentation is holding them back\./)
    ).toBeDefined();
    expect(
      screen.getByText(/"The code is there, but clean up the showcase before the technical round\."/)
    ).toBeDefined();
    expect(
      screen.getByText('Healthy project volume across Python and React')
    ).toBeDefined();
    expect(
      screen.getByText('Missing profile README header')
    ).toBeDefined();
  });
});
