// components/ColorMinter.tsx
import { PlusIcon } from '@heroicons/react/16/solid';
import { ColorPicker } from 'antd';
import type { ColorPickerProps } from 'antd/es/color-picker';
import classNames from 'classnames';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { PiSpinnerGapLight } from "react-icons/pi";
import { useOnClickOutside } from 'usehooks-ts';
import { useAccount } from 'wagmi';
import { ColorArrowNftAbi } from '~/utils/ColorArrowNFTABI';

interface ColorMinterProps {
    colorCheckerContract: ethers.Contract | null;
}

const ColorMinter: React.FC<ColorMinterProps> = ({ colorCheckerContract }) => {
    const [color, setColor] = useState<ColorPickerProps['value']>('#1677ff');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isColorAvailable, setIsColorAvailable] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [etherscanLink, setEtherscanLink] = useState<string | null>(null);
    const [isColorMinterOpen, setIsColorMinterOpen] = useState(false);
    const wrapperRef = useRef(null);
    const antPopperRef = useRef<HTMLElement | null>(null);

    useOnClickOutside(wrapperRef, () => {
        // const isColorSelectorOpen = !!document.querySelector('.ant-popover');
        const isColorSelectorClosed = !!document.querySelector('.ant-popover-hidden');

        if (!isMinting) {
            if (!!isColorSelectorClosed) {
                setIsColorMinterOpen(false)
            }
        }
    })

    useEffect(() => {
        antPopperRef.current = document.querySelector('.ant-popover') || null;
    })


    const { address } = useAccount();

    const handleColorChange: ColorPickerProps['onChange'] = async (value, hex) => {
        setColor(value);
        setErrorMessage(null);
        setIsColorAvailable(true);

        try {
            if (!colorCheckerContract) {
                throw new Error("No contract");
            }

            const { tokenId } = await colorCheckerContract.getColorData(hex);

            if (!tokenId.isZero()) {
                const owner = await colorCheckerContract.ownerOf(tokenId);
                setIsColorAvailable(false);

                // const ensData = await fetch(`https://api.ensdata.net/${owner}`).then(a => a.json())
                setErrorMessage(`Owned by ${owner.slice(0, 6)}...${owner.slice(-4)}`);
            }
        } catch (error) {
            console.error('Error checking color availability:', error);
            setIsColorAvailable(true);
        }
    };


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

            setTransactionHash(transactionHash);
            setEtherscanLink(etherscanLink);
        } catch (error) {
            console.error('Failed to mint NFT:', error);
            setErrorMessage('Failed to mint NFT. Try again.');
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <>
            <div
                onClick={() => {
                    if (!isColorMinterOpen) {
                        setIsColorMinterOpen(true);
                    }
                }}
                ref={wrapperRef}
                className='rounded cursor-pointer ring-2 ring-black/20 ring-dashed ring-offset-2 flex items-center justify-center text-black/40 hover:bg-white/80'>

                <style jsx global>{`
                .custom-color-picker .ant-color-picker-trigger {
                display: none;  // Hide the dropdown trigger
                }
                .custom-color-picker.ant-color-picker-trigger {
                border: none !important;
                border-top-right-radius: 0 !important;
                border-bottom-right-radius: 0 !important;
                justify-content: start;
                align-items: center;
                background: #f2f2f2 !important;
                }
                .custom-color-picker.ant-color-picker-trigger:hover {
                background: #d6ddf8 !important;
                }
                .custom-color-picker .ant-color-picker-color-block {
                max-width: 100%;  // Prevent overflow
                max-height: 100%;
                }
            `}</style>

                {isColorMinterOpen ? (
                    <div className="flex justify-center items-center flex-1 w-full">
                        <ColorPicker value={color} onChange={handleColorChange} showText disabledAlpha={true}
                            format="hex" className="custom-color-picker flex-1 justify-start" />
                        <button
                            onClick={isColorAvailable ? mintColor : undefined}
                            disabled={!isColorAvailable}
                            className={classNames(
                                `px-4 rounded-full h-full transition-colors font-medium duration-200 flex items-center`,
                                isColorAvailable && !isMinting
                                    ? 'bg-white text-black'
                                    : 'bg-white text-gray-400 cursor-not-allowed'

                            )}
                        >
                            {isMinting && <PiSpinnerGapLight className='h-6 w-6 mx-1 text-black animate-spin' />}
                            {!isMinting && <span>Mint</span>}
                            {/* {isMinting ? 'Minting...' :
            transactionHash ? (
                <a href={etherscanLink!} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    View on Basescan
                </a>
            ) :
                'Mint'} */}
                        </button>
                    </div>
                ) : (
                    <PlusIcon className='h-8 w-8' />
                )}
            </div>
            {errorMessage && (
                <motion.div animate={{
                    height: errorMessage.length ? 'auto' : 0,
                }} className="text-red-500 !mt-2 text-sm ">{errorMessage}</motion.div>
            )}
        </>
    );
};

export default ColorMinter;