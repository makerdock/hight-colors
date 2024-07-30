export function hasGoodContrast(hexColor: string) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate relative luminance
    const luminance = (c: number) => {
        const cNormalized = c / 255.0;
        return cNormalized <= 0.03928
            ? cNormalized / 12.92
            : Math.pow((cNormalized + 0.055) / 1.055, 2.4);
    };

    const l = 0.2126 * luminance(r) + 0.7152 * luminance(g) + 0.0722 * luminance(b);

    // Calculate contrast ratio (white has luminance of 1)
    const contrastRatio = l > 1 ? (l + 0.05) / (1 + 0.05) : (1 + 0.05) / (l + 0.05);
    console.log("🚀 ~ hasGoodContrast ~ contrastRatio:", contrastRatio)

    // WCAG 2.0 level AA requires a contrast ratio of at least 4.5:1
    return contrastRatio >= 1.2;
}

