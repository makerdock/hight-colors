// components/ColorMinter.tsx
import React, { useEffect, useState } from 'react';
import { ChromePicker, ColorChangeHandler } from 'react-color';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { ColorArrowNftAbi } from '~/utils/ColorArrowNFTABI';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/16/solid';

interface ColorMinterProps {
    isOpen: boolean;
    onClose: () => void;
    colorCheckerContract: ethers.Contract | null;
}

const ColorMinter: React.FC<ColorMinterProps> = ({ isOpen, onClose, colorCheckerContract }) => {
    const [color, setColor] = useState('#000000');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isColorAvailable, setIsColorAvailable] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [etherscanLink, setEtherscanLink] = useState<string | null>(null);
    const { address } = useAccount();

    const handleColorPickerChange: ColorChangeHandler = async (color) => {
        setColor(color.hex);
        setErrorMessage(null);
        setIsColorAvailable(true);

        try {
            if (!colorCheckerContract) {
                throw new Error("No contract");
            }

            const { tokenId } = await colorCheckerContract.getColorData(color.hex);

            if (!tokenId.isZero()) {
                const owner = await colorCheckerContract.ownerOf(tokenId);
                setIsColorAvailable(false);
                setErrorMessage(`This color is owned by ${owner.slice(0, 6)}...${owner.slice(-4)}`);
            }
        } catch (error) {
            console.error('Error checking color availability:', error);
            setIsColorAvailable(true);
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Reset state when the minter is opened
            setColor('#000000');
            setErrorMessage(null);
            setIsColorAvailable(true);
            setIsMinting(false);
            setTransactionHash(null);
            setEtherscanLink(null);
        }
    }, [isOpen]);


    const mintColor = async (): Promise<void> => {
        if (typeof window.ethereum === 'undefined') {
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contractAddress = '0x7Bc1C072742D8391817EB4Eb2317F98dc72C61dB';
        const mintContract = new ethers.Contract(contractAddress, ColorArrowNftAbi, signer);

        setIsMinting(true);
        try {
            const colorWithoutHash = color.slice(1);
            const value = await mintContract.mintPrice();
            const transaction = await mintContract.mint(color, colorWithoutHash, address, {
                value: value
            });

            console.log('Transaction sent. Waiting for confirmation...');
            const receipt = await transaction.wait();

            const transactionHash = receipt.transactionHash;
            console.log('NFT minted successfully!');
            console.log('Transaction Hash:', transactionHash);

            const etherscanLink = `https://basescan.org/tx/${transactionHash}`;
            console.log('Basescan Link:', etherscanLink);

            setTransactionHash(transactionHash);
            setEtherscanLink(etherscanLink);
        } catch (error) {
            console.error('Failed to mint NFT:', error);
            setErrorMessage('Failed to mint NFT. Please try again.');
        } finally {
            setIsMinting(false);
        }
    };
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                        <div className="relative mb-4">
                            <DialogTitle className="text-2xl font-bold leading-6 text-black">
                                Mint a New Color
                            </DialogTitle>
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute top-0 right-0 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 flex flex-col items-center">
                            <ChromePicker color={color} onChange={handleColorPickerChange} />
                            {errorMessage && (
                                <p className="text-black mt-4">{errorMessage}</p>
                            )}
                            {isColorAvailable && (
                                <div className="mt-4 flex flex-col items-center">
                                    <div
                                        className="w-52 h-52 rounded shadow-lg"
                                        style={{ backgroundColor: color }}
                                    ></div>
                                    <button
                                        onClick={mintColor}
                                        disabled={isMinting}
                                        className="px-8 py-2 bg-black text-white rounded-3xl hover:bg-gray-600 mt-4"
                                    >
                                        {isMinting ? 'Minting...' : 'Mint Color'}
                                    </button>
                                </div>
                            )}
                            {transactionHash && etherscanLink && (
                                <div className="mt-4">
                                    <a href={etherscanLink} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                                        View on Basescan
                                    </a>
                                </div>
                            )}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};


export default ColorMinter;