import { createGlobalStyle, css } from 'styled-components';

export const device = {
    mobile: css`(max-width: 30 rem)`,
    tablet: css`(max-width: 52.5 rem)`,
};

export const GlobalStyle = createGlobalStyle`
    :root {
        --innhold-bredde: 32.75rem;
        color: var(--ax-text-neutral);
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
