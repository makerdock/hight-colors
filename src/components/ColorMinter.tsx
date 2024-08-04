// components/ColorMinter.tsx
import React, { useEffect, useState } from 'react';
import { ChromePicker, ColorChangeHandler } from 'react-color';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { ColorArrowNftAbi } from '~/utils/ColorArrowNFTABI';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/16/solid';
import { ColorPicker, Space } from 'antd';
import type { ColorPickerProps } from 'antd/es/color-picker';
import classNames from 'classnames';

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
            const hexColor = typeof color === 'string' ? color : color?.toHexString();
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
        <div className="flex items-start space-y-4 justify-center w-full relative">



            <style jsx global>{`
  .custom-color-picker .ant-color-picker-trigger {
    display: none;  // Hide the dropdown trigger
  }
  .custom-color-picker .ant-color-picker-color-block {
    max-width: 100%;  // Prevent overflow
    max-height: 100%;
  }
`}</style>
            <div className="flex items-center space-x-2 justify-cente align-middle flex-1 w-full">
                <ColorPicker value={color} onChange={handleColorChange} showText disabledAlpha={true}
                    format="hex" className="custom-color-picker flex-1 justify-start" />
                <button
                    onClick={isColorAvailable ? mintColor : undefined}
                    disabled={isMinting || !isColorAvailable}
                    className={classNames(
                        `px-4 rounded-full transition-colors font-medium duration-200`,
                        isColorAvailable && !isMinting
                            ? 'bg-white text-black hover:bg-black hover:text-white border border-black'
                            : 'bg-gray-200 text-gray-600 cursor-not-allowed'

                    )}
                >
                    {isMinting ? 'Minting...' :
                        transactionHash ? (
                            <a href={etherscanLink!} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                View on Basescan
                            </a>
                        ) :
                            'Mint'}
                </button>
            </div>
            {errorMessage && (
                <div className="text-red-500 !mt-2 text-sm absolute top-full left-0 w-full">{errorMessage}</div>
            )}
        </div>
    );
};

export default ColorMinter;