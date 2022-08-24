import React from 'react';

import styled from 'styled-components';

import { Alert, AlertProps } from '@navikt/ds-react';

interface AlertStripeProps extends AlertProps {
    dynamisk?: boolean;
    className?: '';
}

const StyledAlertStripe = styled(Alert)`
    p {
        margin: 0;
    }
`;

const AlertStripe: React.FC<AlertStripeProps> = ({
    variant,
    inline = true,
    size = 'medium',
    fullWidth = false,
    dynamisk = false,
    className,
    children,
}) => {
    return (
        <StyledAlertStripe
            className={className}
            variant={variant}
            inline={inline}
            size={size}
            fullWidth={fullWidth}
            aria-live={dynamisk ? 'polite' : 'off'}
        >
            <p>{children}</p>
        </StyledAlertStripe>
    );
};

export default AlertStripe;
