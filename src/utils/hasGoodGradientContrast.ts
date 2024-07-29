type RGB = [number, number, number];

export function hasGoodGradientContrast(hexColor1: string, hexColor2: string): boolean {
    // Check contrast for both colors
    const contrast1 = getContrastRatio(hexColor1);
    const contrast2 = getContrastRatio(hexColor2);

    // Check contrast for the average color
    const avgColor = getAverageColor(hexColor1, hexColor2);
    const contrastAvg = getContrastRatio(avgColor);

    // WCAG 2.0 level AA requires a contrast ratio of at least 4.5:1
    return contrast1 >= 4.5 && contrast2 >= 4.5 && contrastAvg >= 4.5;
}

function getContrastRatio(hexColor: string): number {
    const rgb = hexToRgb(hexColor);
    const l = getLuminance(rgb);
    return l > 1 ? (l + 0.05) / (1 + 0.05) : (1 + 0.05) / (l + 0.05);
}

function hexToRgb(hex: string): RGB {
    console.log("🚀 ~ hexToRgb ~ hex:", hex)
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

function getLuminance([r, g, b]: RGB): number {
    const [rr, gg, bb] = [r, g, b].map(c => {
        const cNormalized = c / 255.0;
        return cNormalized <= 0.03928
            ? cNormalized / 12.92
            : Math.pow((cNormalized + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
}

function getAverageColor(hex1: string, hex2: string): string {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const avgRgb = rgb1.map((c, i) => Math.round((c + rgb2[i]) / 2));
    return `#${avgRgb.map(c => c.toString(16).padStart(2, '0')).join('')}`;
}
