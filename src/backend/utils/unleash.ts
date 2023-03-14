import { initialize, Strategy } from 'unleash-client';

class ByClusterStrategy extends Strategy {
    private cluster: string = process.env.NAIS_CLUSTER_NAME ?? 'lokalutvikling';

    constructor() {
        super('byCluster');
    }

    isEnabled(parameters: Record<string, string> | undefined): boolean {
        const clustersKommaseparert: string = parameters ? parameters['cluster'] : '';
        const clusters = clustersKommaseparert.split(',');

        return !!clusters.find(enabletForCluster => enabletForCluster === this.cluster);
    }
}

const unleash = initialize({
    url: 'https://unleash.nais.io/api/',
    appName: process.env.NAIS_APP_NAME ?? 'familie-ks-soknad',
    strategies: [new ByClusterStrategy()],
});

export const isEnabled = (feature: string, defaultValue?: boolean): boolean => {
    // Hvis vi bare deconstructer og eksporterer isEnabled fra unleash crasher det fordi isEnabled ikke veit hva `this` er...
    return unleash.isEnabled(feature, undefined, defaultValue);
};
