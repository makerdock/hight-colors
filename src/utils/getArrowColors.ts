interface ArrowColorProps {
    primaryColor?: string;
    secondaryColor?: string;
    bgMode: boolean;
    invertMode: boolean;
}

export function getArrowColors({ primaryColor, secondaryColor, bgMode, invertMode }: ArrowColorProps): { arrowColor: string; backgroundColor: string } {
    // Default secondaryColor to primaryColor if not provided
    const effectiveSecondaryColor = secondaryColor || primaryColor;

    // Determine fallback color based on invertMode
    const fallbackColor = invertMode ? 'black' : 'white';

    // Determine background color
    const backgroundColor = bgMode && primaryColor ?
        `linear-gradient(to bottom right, ${primaryColor}, ${effectiveSecondaryColor})` :
        fallbackColor;

    // Determine arrow color
    const arrowColor = !bgMode && primaryColor ?
        `linear-gradient(to bottom right, ${primaryColor}, ${effectiveSecondaryColor})` :
        fallbackColor;

    return { arrowColor, backgroundColor };
}