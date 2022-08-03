import React from 'react';

import { render, screen } from '@testing-library/react';

import SystemetLaster from './SystemetLaster';

test('Kan rendre SystemetLaster', () => {
    render(<SystemetLaster />);
    expect(screen.getByText('Søknaden laster')).toBeInTheDocument();
});
