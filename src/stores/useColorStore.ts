import { create } from 'zustand'

interface ColorState {
    primaryColor: string | undefined
    secondaryColor: string | undefined
    isGradientMode: boolean
    isBGMode: boolean
    invertMode: boolean
    setPrimaryColor: (color: string | undefined) => void
    setSecondaryColor: (color: string | undefined) => void
    setIsGradientMode: (isGradient: boolean) => void
    setIsBGMode: (isBG: boolean) => void
    setInvertMode: (invert: boolean) => void
}

export const useColorStore = create<ColorState>((set) => ({
    primaryColor: undefined,
    secondaryColor: undefined,
    isGradientMode: false,
    isBGMode: false,
    invertMode: false,
    setPrimaryColor: (color) => set({ primaryColor: color }),
    setSecondaryColor: (color) => set({ secondaryColor: color }),
    setIsGradientMode: (isGradient) => set({ isGradientMode: isGradient }),
    setIsBGMode: (isBG) => set({ isBGMode: isBG }),
    setInvertMode: (invert) => set({ invertMode: invert }),
}))

export default useColorStore