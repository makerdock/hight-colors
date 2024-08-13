import { create } from 'zustand'
import { toast } from '~/components/ui/use-toast'
import { env } from '~/env'
import { AlchemyResponse, OwnedNft } from '~/utils/alchemyResponse'
// import { useAccount, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'

type NFTMetadata = {
    name: string
    description: string
    image: string
    attributes: Array<{
        trait_type: string
        value: string
    }>
}

interface ColorState {
    primaryColor: string | undefined
    secondaryColor: string | undefined
    isGradientMode: boolean
    isBGMode: boolean
    invertMode: boolean
    sidebarMode: "mint" | "success" | "loading"
    mintError: string | undefined
    setSidebarMode: (mode: "mint" | "success" | "loading") => void
    setPrimaryColor: (color: string | undefined) => void
    setSecondaryColor: (color: string | undefined) => void
    setIsGradientMode: (isGradient: boolean) => void
    setIsBGMode: (isBG: boolean) => void
    setInvertMode: (invert: boolean) => void
    setMintError: (error: string | undefined) => void

    // mintArrow: () => Promise<void>
    // mintArrowWithHigher: () => Promise<void>
    transactionHash?: string
    etherscanLink?: string

    ownedArrows: OwnedNft[]
    setOwnedArrows: (arrows: OwnedNft[]) => void

    fetchOwnedArrows: (address: string) => Promise<void>
    isFetchingOwnedArrows: boolean
    setIsFetchingOwnedArrows: (isFetching: boolean) => void

    mintedNftMetadata?: NFTMetadata
    setMintedNftMetadata: (metadata: NFTMetadata) => void
}

export const useColorStore = create<ColorState>((set, get) => ({
    primaryColor: undefined,
    secondaryColor: undefined,
    sidebarMode: "success",
    mintError: undefined,
    isGradientMode: false,
    isBGMode: false,
    invertMode: false,
    transactionHash: undefined,
    etherscanLink: undefined,
    isFetchingOwnedArrows: false,
    ownedArrows: [],

    setSidebarMode: (mode) => set({ sidebarMode: mode }),
    setMintError: (error) => set({ mintError: error }),
    setPrimaryColor: (color) => set({ primaryColor: color }),
    setSecondaryColor: (color) => set({ secondaryColor: color }),
    setIsGradientMode: (isGradient) => set({ isGradientMode: isGradient }),
    setIsBGMode: (isBG) => set({ isBGMode: isBG }),
    setInvertMode: (invert) => set({ invertMode: invert }),
    setMintedNftMetadata: (metadata) => set({ mintedNftMetadata: metadata }),
    setOwnedArrows: (arrows) => set({ ownedArrows: arrows }),
    setIsFetchingOwnedArrows: (isFetching) => set({ isFetchingOwnedArrows: isFetching }),
    fetchOwnedArrows: async (address: string) => {
        set({ isFetchingOwnedArrows: true });
        try {
            const response = await fetch(`/api/getColors?ownerAddress=${address}&contractAddress=${env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}`);
            if (!response.ok) {
                throw new Error('Failed to fetch NFTs');
            }
            const data: AlchemyResponse = await response.json();
            set({ ownedArrows: data.ownedNfts });
        } catch (error) {
            console.error('Error fetching owned NFTs:', error);
            toast({
                variant: "destructive",
                title: 'Error',
                description: 'Failed to fetch owned NFTs. Please try again later.'
            });
        } finally {
            set({ isFetchingOwnedArrows: false });
        }
    },
}))

export default useColorStore