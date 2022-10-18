export const slåSammen = (tekstListe: string[]) => {
    if (tekstListe.length === 0) {
        return '';
    }

    if (tekstListe.length === 1) {
        return tekstListe[0];
    }

    return tekstListe.join(', ').replace(/,(?=[^,]+$)/, ' og');
};
