import { createGlobalStyle, css } from 'styled-components';

import { AGray900 } from '@navikt/ds-tokens/dist/tokens';

export const device = {
    mobile: css`(max-width: 30rem)`,
    tablet: css`(max-width: 52.5rem)`,
};

export const GlobalStyle = createGlobalStyle`
  :root {
    --innhold-bredde: 32.75rem;
    color: ${AGray900};
    font-family: 'Source Sans Pro', Arial, sans-serif;

    && label,
    legend,
    a,
    p,
    li {
      font-size: 1.125rem;
      line-height: 1.625rem;
    }
  }

  body {
    margin: 0;
  }

  .blur {
    filter: blur(12px);
    -webkit-filter: blur(12px);
    pointer-events: none;
  }

  #familie-ks-soknad-page-container {
  position: relative;
  min-height: 100vh;
}
`;
