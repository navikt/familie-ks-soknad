import React from 'react';

import { FormattedMessage } from 'react-intl';
import { Props as MessageProps } from 'react-intl/lib/src/components/message';

export const innebygdeFormatterere = {
    linjeskift: <br />,
    b: msg => <b>{msg}</b>,
    punktliste: msg => <ul>{msg}</ul>,
    punkt: msg => <li>{msg}</li>,
    p: msg => <p>{msg}</p>,
    bokmål: msg => <span lang="nb">{msg}</span>,
};

const SpråkTekst: React.FC<MessageProps> = props => {
    const propsMedFellesFunksjoner: MessageProps = {
        ...props,
        values: {
            ...props.values,
            ...innebygdeFormatterere,
        },
    };

    return <FormattedMessage {...propsMedFellesFunksjoner} />;
};

export default SpråkTekst;
