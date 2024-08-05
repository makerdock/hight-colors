import { ethers } from 'ethers'
import { create } from 'zustand'
import { higherArrowNftAbi } from '~/utils/abi'
import { ColorArrowNftAbi } from '~/utils/ColorArrowNFTABI'

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
    mintArrow: () => Promise<void>
    transactionHash?: string
    etherscanLink?: string
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
    mintArrow: async (): Promise<void> => {
        if (typeof window.ethereum === 'undefined') {
            return;
        }


        // Specify the Base Sepolia network
        const baseSepolia = {
            chainId: '0x14a34', // 84532 in decimal
            chainName: 'Base Sepolia',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://sepolia.base.org'],
            blockExplorerUrls: ['https://sepolia.basescan.org'],
        };
        // Request network change
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: baseSepolia.chainId }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if ((switchError as any).code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [baseSepolia],
                    });
                } catch (addError) {
                    console.error('Failed to add Base Sepolia network', addError);
                    return;
                }
            } else {
                console.error('Failed to switch to Base Sepolia network', switchError);
                return;
            }
        }


        const { primaryColor, secondaryColor, isBGMode, invertMode } = get();
        console.log("🚀 ~ mintArrow: ~ primaryColor, secondaryColor, isBGMode, invertMode:", primaryColor, secondaryColor, isBGMode, invertMode)

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(1)
        const contractAddress = '0x515d45F06EdD179565aa2796388417ED65E88939';
        const mintContract = new ethers.Contract(contractAddress, higherArrowNftAbi, signer);

        set({ sidebarMode: "loading" });
        try {
            const transaction = await mintContract.mint(primaryColor, primaryColor, isBGMode, invertMode);

            console.log('Transaction sent. Waiting for confirmation...');
            const receipt = await transaction.wait();

            const transactionHash = receipt.transactionHash;
            console.log('NFT minted successfully!');
            console.log('Transaction Hash:', transactionHash);

            const etherscanLink = `https://basescan.org/tx/${transactionHash}`;
            console.log('Basescan Link:', etherscanLink);

            // setTransactionHash(transactionHash);
            // setEtherscanLink(etherscanLink);
        } catch (error) {
            console.error(error);
            set({ mintError: 'Failed to mint NFT. Try again.', sidebarMode: "mint" });
        } finally {
            set({ sidebarMode: "mint" });
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
            set({ mintError: 'Failed to mint NFT. Try again.', sidebarMode: "mint" });
        }
    }
}))

export default useColorStore