import React from 'react';

import { BodyShort, InfoCard, type InfoCardProps } from '@navikt/ds-react';

interface Props {
    image: React.ReactNode;
    icon: React.ReactNode;
    variant: InfoCardProps['data-color'];
    statusText: string;
    description: string;
}

const PictureScanningExample = ({ image, icon, variant, statusText, description }: Props) => (
    <InfoCard data-color={variant}>
        <InfoCard.Header icon={icon}>
            <InfoCard.Title>{statusText}</InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>
            <BodyShort spacing>{description}</BodyShort>
            {image}
        </InfoCard.Content>
    </InfoCard>
);

export default PictureScanningExample;
