function rawJsonLoader(source: string): string {
    return `module.exports = ${source};`;
}

module.exports = rawJsonLoader;
