import React from 'react';

import { Alert, type AlertProps, BodyShort, Label } from '@navikt/ds-react';

interface Props {
    image: React.ReactNode;
    variant: AlertProps['variant'];
    statusText: string;
    description: string;
}

const PictureScanningExample = ({ image, variant, statusText, description }: Props) => (
    <Alert variant={variant}>
        <Label as="div">{statusText}</Label>
        <BodyShort spacing>{description}</BodyShort>
        {image}
    </Alert>
);

export default PictureScanningExample;
