interface ArrowColorProps {
    primaryColor?: string;
    bgMode: boolean;
    invertMode: boolean;
}

export function getArrowColors({ primaryColor, bgMode, invertMode }: ArrowColorProps): { arrowColor: string; backgroundColor: string } {
    // Determine the contrast color (black or white)
    const contrastColor = invertMode ? '000000' : 'FFFFFF';

    // If primaryColor is not provided, default to the contrast color
    const effectivePrimaryColor = primaryColor || contrastColor;

    // Determine background color
    const backgroundColor = bgMode ? effectivePrimaryColor : contrastColor;

    // Determine arrow color
    const arrowColor = bgMode ? contrastColor : effectivePrimaryColor;

    return { backgroundColor: arrowColor.replace('#', ''), arrowColor: backgroundColor.replace('#', '') };
}