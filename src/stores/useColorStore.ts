import { create } from 'zustand'

interface ColorState {
    primaryColor: string | undefined
    secondaryColor: string | undefined
    isGradientMode: boolean
    isBGMode: boolean
    setPrimaryColor: (color: string | undefined) => void
    setSecondaryColor: (color: string | undefined) => void
    setIsGradientMode: (isGradient: boolean) => void
    setIsBGMode: (isBG: boolean) => void
}

export const useColorStore = create<ColorState>((set) => ({
    primaryColor: undefined,
    secondaryColor: undefined,
    isGradientMode: false,
    isBGMode: false,
    setPrimaryColor: (color) => set({ primaryColor: color }),
    setSecondaryColor: (color) => set({ secondaryColor: color }),
    setIsGradientMode: (isGradient) => set({ isGradientMode: isGradient }),
    setIsBGMode: (isBG) => set({ isBGMode: isBG }),
}))

export default useColorStore