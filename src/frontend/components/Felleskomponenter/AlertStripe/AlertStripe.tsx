import React from 'react';

import styled from 'styled-components';

import { AlertStripeType, default as NavAlertStripe } from 'nav-frontend-alertstriper';

interface AlertStripeProps {
    type?: AlertStripeType;
    form?: 'default' | 'inline' | undefined;
    dynamisk?: boolean;
    className?: '';
}

const StyledAlertStripe = styled(NavAlertStripe)`
    p {
        margin: 0;
    }
`;

const AlertStripe: React.FC<AlertStripeProps> = ({
    type = 'info',
    form = 'inline',
    dynamisk = false,
    className,
    children,
}) => {
    return (
        <StyledAlertStripe
            className={className}
            type={type}
            form={form}
            aria-live={dynamisk ? 'polite' : 'off'}
        >
            <p>{children}</p>
        </StyledAlertStripe>
    );
};

export default AlertStripe;
