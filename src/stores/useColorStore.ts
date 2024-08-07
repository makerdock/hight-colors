import { chains, createSession, currencies } from '@paywithglide/glide-js'
import { ethers } from 'ethers'
import { base } from 'viem/chains'
import { create } from 'zustand'
import { toast } from '~/components/ui/use-toast'
import { env } from '~/env'
import { higherArrowNftAbi } from '~/utils/abi'
import { AlchemyResponse, OwnedNft } from '~/utils/alchemyResponse'
import { ColorArrowNftAbi } from '~/utils/ColorArrowNFTABI'
import { glide } from '~/utils/glide'

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
    mintArrowWithHigher: () => Promise<void>
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

    mintArrowWithHigher: async (): Promise<void> => {
        if (typeof window.ethereum === 'undefined') {
            return;
        }

        console.log("🚀 ~ mintArrowWithHigher: ~ base.id:", base)
        // try {
        //     await window.ethereum.request({
        //         method: 'wallet_switchEthereumChain',
        //         params: [base],
        //     });
        // } catch (switchError) {
        //     console.log("🚀 ~ mintArrowWithHigher: ~ switchError:", switchError)
        //     if ((switchError as any).code === 4902) {
        //         try {
        //             await window.ethereum.request({
        //                 method: 'wallet_addEthereumChain',
        //                 params: [base],
        //             });
        //         } catch (addError) {
        //             console.error('Failed to add network', addError);
        //             return;
        //         }
        //     } else {
        //         console.error('Failed to switch to network', switchError);
        //         return;
        //     }
        // }

        const { primaryColor, isBGMode, invertMode } = get();

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const nftContractAddress = '0xca7c785c1cfb5748ea3d75cbbb6967133908e2ac';
        const higherTokenAddress = '0x328827640c6a58AC16A692841ffe5DF185e2be6b';

        const nftContract = new ethers.Contract(nftContractAddress, higherArrowNftAbi, signer);

        const higherTokenContract = new ethers.Contract(higherTokenAddress, [
            'function approve(address spender, uint256 amount) public returns (bool)',
            'function allowance(address owner, address spender) public view returns (uint256)'
        ], signer);

        set({ sidebarMode: "loading" });
        try {
            // Check current allowance
            const userAddress = await signer.getAddress();
            const currentAllowance = await higherTokenContract.allowance(userAddress, nftContractAddress);
            const requiredAmount = ethers.utils.parseUnits("100", 18); // Assuming 18 decimals for Higher token

            // If current allowance is less than required, approve the NFT contract to spend Higher tokens
            if (currentAllowance.lt(requiredAmount)) {
                console.log('Approving Higher token spend...');
                const approvalTx = await higherTokenContract.approve(nftContractAddress, requiredAmount);
                await approvalTx.wait();
                console.log('Approval successful');
            }

            console.log('Minting NFT with Higher token...');
            const transaction = await nftContract.mintWithHigher(primaryColor, isBGMode, invertMode);

            console.log('Transaction sent. Waiting for confirmation...');
            const receipt = await transaction.wait();

            const transactionHash = receipt.transactionHash;
            console.log("🚀 ~ mintArrow: ~ receipt:", receipt)
            console.log('NFT minted successfully!');
            console.log('Transaction Hash:', transactionHash);

            const etherscanLink = `https://basescan.org/tx/${transactionHash}`;
            console.log('Basescan Link:', etherscanLink);

            // Find the Transfer event in the logs
            const transferLog = receipt.logs.find((log: any) => {
                try {
                    const parsedLog = new ethers.utils.Interface(higherArrowNftAbi).parseLog(log);
                    return parsedLog.name === 'Transfer' && parsedLog.args.from === ethers.constants.AddressZero;
                } catch {
                    return false;
                }
            });

            if (!transferLog) {
                throw new Error('No mint Transfer event found in the transaction');
            }

            // Parse the Transfer event to get the contract address and token ID
            const parsedTransferLog = new ethers.utils.Interface(higherArrowNftAbi).parseLog(transferLog);
            const tokenId = parsedTransferLog.args.tokenId;
            console.log("🚀 ~ mintArrow: ~ tokenId:", tokenId)

            // Get the token URI
            const tokenURI = await nftContract.tokenURI(tokenId);
            console.log("🚀 ~ mintArrow: ~ tokenURI:", tokenURI)

            // fetch the json from the uri
            const tokenData = await fetch(tokenURI).then(a => a.json());
            console.log("🚀 ~ mintArrow: ~ tokenData:", tokenData)

            set({ sidebarMode: "success" })
        } catch (error) {
            console.error(error);
            set({ sidebarMode: "mint" });

            toast({
                variant: "destructive",
                title: 'Something went wrong.',
                description: 'Could not mint NFT, please try again later.'
            });
        }
    },

    mintArrow: async (): Promise<void> => {
        if (typeof window.ethereum === 'undefined') {
            return;
        }


        // Specify the Base Sepolia network
        // const baseSepolia = {
        //     chainId: '0x14a34', // 84532 in decimal
        //     chainName: 'Base Sepolia',
        //     nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        //     rpcUrls: ['https://sepolia.base.org'],
        //     blockExplorerUrls: ['https://sepolia.basescan.org'],
        // };
        // Request network change
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: base.id }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if ((switchError as any).code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [base.id],
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

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contractAddress = env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
        const mintContract = new ethers.Contract(contractAddress, higherArrowNftAbi, signer);

        set({ sidebarMode: "loading" });
        try {
            const transaction = await mintContract.mint(primaryColor, primaryColor, isBGMode, invertMode);

            console.log('Transaction sent. Waiting for confirmation...');
            const receipt = await transaction.wait();

            const transactionHash = receipt.transactionHash;
            console.log("🚀 ~ mintArrow: ~ receipt:", receipt)
            console.log('NFT minted successfully!');
            console.log('Transaction Hash:', transactionHash);

            const etherscanLink = `https://basescan.org/tx/${transactionHash}`;
            console.log('Basescan Link:', etherscanLink);


            // Find the Transfer event in the logs
            const transferLog = receipt.logs.find((log: any) => {
                try {
                    const parsedLog = new ethers.utils.Interface(higherArrowNftAbi).parseLog(log);
                    return parsedLog.name === 'Transfer' && parsedLog.args.from === ethers.constants.AddressZero;
                } catch {
                    return false;
                }
            });

            if (!transferLog) {
                throw new Error('No mint Transfer event found in the transaction');
            }

            // Parse the Transfer event to get the contract address and token ID
            const parsedTransferLog = new ethers.utils.Interface(higherArrowNftAbi).parseLog(transferLog);
            const contractAddress = transferLog.address;
            const tokenId = parsedTransferLog.args.tokenId;
            console.log("🚀 ~ mintArrow: ~ tokenId:", tokenId)


            // Get the token URI
            const tokenURI = await mintContract.tokenURI(tokenId);
            console.log("🚀 ~ mintArrow: ~ tokenURI:", tokenURI)

            // fetch the json from the uri
            const tokenData = await fetch(tokenURI).then(a => a.json());
            console.log("🚀 ~ mintArrow: ~ tokenData:", tokenData)

            set({ sidebarMode: "success" })
            // setTransactionHash(transactionHash);
            // setEtherscanLink(etherscanLink);
        } catch (error) {
            console.error(error);
            set({ sidebarMode: "mint" });

            toast({
                variant: "destructive",
                title: 'Something went wrong.',
                description: 'Could not mint NFT, please try again later.'
            });

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