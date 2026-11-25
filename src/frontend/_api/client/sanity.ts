import miljø from '@common/miljø';
import { createClient } from '@sanity/client';

export const sanityKlient = createClient({
    projectId: 'by26nl8j',
    dataset: miljø().sanityDataset,
    apiVersion: '2021-10-21',
    useCdn: true,
});
