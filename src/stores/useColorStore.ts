import { ethers } from 'ethers'
import { create } from 'zustand'
import { toast } from '~/components/ui/use-toast'
import { env } from '~/env'
import { higherArrowNftAbi } from '~/utils/abi'
import { AlchemyResponse, OwnedNft } from '~/utils/alchemyResponse'
import { ColorArrowNftAbi } from '~/utils/ColorArrowNFTABI'
// import { useAccount, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { base } from 'wagmi/chains'

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
    mintColor: (color: string, address: string) => Promise<void>
    // mintArrow: () => Promise<void>
    // mintArrowWithHigher: () => Promise<void>
    transactionHash?: string
    etherscanLink?: string

    ownedArrows: OwnedNft[]
    setOwnedArrows: (arrows: OwnedNft[]) => void
    mintedArrow?: OwnedNft
    setMintedArrow: (arrow: OwnedNft) => void

    fetchOwnedArrows: (address: string) => Promise<void>
    isFetchingOwnedArrows: boolean
    setIsFetchingOwnedArrows: (isFetching: boolean) => void
}

export const useColorStore = create<ColorState>((set, get) => ({
    primaryColor: undefined,
    secondaryColor: undefined,
    sidebarMode: "mint",
    setSidebarMode: (mode) => set({ sidebarMode: mode }),
    mintError: undefined,
    setMintError: (error) => set({ mintError: error }),
    isGradientMode: false,
    isBGMode: false,
    invertMode: false,
    transactionHash: undefined,
    etherscanLink: undefined,
    setPrimaryColor: (color) => set({ primaryColor: color }),
    setSecondaryColor: (color) => set({ secondaryColor: color }),
    setIsGradientMode: (isGradient) => set({ isGradientMode: isGradient }),
    setIsBGMode: (isBG) => set({ isBGMode: isBG }),
    setInvertMode: (invert) => set({ invertMode: invert }),

    mintedArrow: undefined,
    setMintedArrow: (arrow) => set({ mintedArrow: arrow }),
    ownedArrows: [],
    setOwnedArrows: (arrows) => set({ ownedArrows: arrows }),
    setIsFetchingOwnedArrows: (isFetching) => set({ isFetchingOwnedArrows: isFetching }),
    isFetchingOwnedArrows: false,
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

    mintColor: async (color: string, address: string): Promise<void> => {
        if (typeof window.ethereum === 'undefined') {
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contractAddress = '0x7Bc1C072742D8391817EB4Eb2317F98dc72C61dB';
        const mintContract = new ethers.Contract(contractAddress, ColorArrowNftAbi, signer);

        // setIsMinting(true);
        set({ mintError: undefined, sidebarMode: "loading" });
        try {
            const hexColor = typeof color === 'string' ? color : (color as any)?.toHexString();
            const colorWithoutHash = hexColor?.slice(1);

            const value = await mintContract.mintPrice();

            const transaction = await mintContract.mint(hexColor, colorWithoutHash, address, {
                value: value
            });

            console.log('Transaction sent. Waiting for confirmation...');
            const receipt = await transaction.wait();

            const transactionHash = receipt.transactionHash;
            console.log('NFT minted successfully!');
            console.log('Transaction Hash:', transactionHash);

            const etherscanLink = `https://basescan.org/tx/${transactionHash}`;
            console.log('Basescan Link:', etherscanLink);

            // setTransactionHash(transactionHash);
            // setEtherscanLink(etherscanLink);
            set({ mintError: undefined, sidebarMode: "success" });
        } catch (error) {
            console.error('Failed to mint NFT:', error);
            set({ sidebarMode: "mint" });
            toast({
                variant: "destructive",
                title: 'Something went wrong.',
                description: 'Could not mint NFT, please try again later.'
            });
        }
    }
}))

export default useColorStore