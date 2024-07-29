// components/OwnedColors.tsx
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Toggle from './Toggle';
import ColorMinter from './ColorMinter';
import { ethers } from 'ethers';
import { ColorArrowNftAbi } from '~/utils/ColorArrowNFTABI';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/16/solid';
import useColorStore from '~/stores/useColorStore';

interface ColorNFT {
    color: string;
}

interface OwnedColorsProps {
    onColorSelect: (color: string, isGradient: boolean, isBGMode: boolean) => void;
}

const OwnedColors: React.FC<OwnedColorsProps> = ({ }) => {
    const { address } = useAccount();
    const [ownedColors, setOwnedColors] = useState<ColorNFT[]>([]);

    const { isBGMode, setIsBGMode, primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor, isGradientMode, setIsGradientMode } = useColorStore()


    const [isColorMinterOpen, setIsColorMinterOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [colorCheckerContract, setColorCheckerContract] = useState<ethers.Contract | null>(null);

    useEffect(() => {
        if (address) {
            fetchOwnedColors(address);
        }
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractAddress = '0x7Bc1C072742D8391817EB4Eb2317F98dc72C61dB';
            const contract = new ethers.Contract(contractAddress, ColorArrowNftAbi, signer);
            setColorCheckerContract(contract);
        }
    }, [address]);

    const handleRefresh = () => {
        if (address) {
            fetchOwnedColors(address);
        }
    };

    const fetchOwnedColors = async (ownerAddress: string) => {
        setIsRefreshing(true);
        try {
            const response = await fetch(`/api/getColors?ownerAddress=${ownerAddress}`);
            if (!response.ok) {
                throw new Error('Failed to fetch NFTs');
            }
            const colors = await response.json();
            setOwnedColors(colors);
        } catch (error) {
            console.error('Error fetching owned NFTs:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleColorBoxClick = (color: string) => {
        if (isGradientMode) {
            if (!primaryColor) {
                setPrimaryColor(color);
            } else if (!secondaryColor) {
                setSecondaryColor(color);
            } else {
                setPrimaryColor(color);
                setSecondaryColor(undefined);
            }
        }
        else {
            setPrimaryColor(color);
        }
    };

    const toggleGradientMode = () => {

        if (isGradientMode) {
            setSecondaryColor(primaryColor)
        } else {
            setSecondaryColor(undefined);
        }

        setIsGradientMode(!isGradientMode);

    };

    const toggleBGMode = () => {
        setIsBGMode(!isBGMode);
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg h-full flex flex-col">
            <h1 className="text-3xl mb-8 md:text-4xl font-bold text-white lg:mb-4">Higher Colors</h1>
            <div className="flex justify-start items-center">
                <h2 className="text-xl font-semibold text-white">Your BaseColors</h2>
                <button
                    onClick={handleRefresh}
                    className="text-gray-600 hover:text-gray-300 transition-colors"
                    disabled={isRefreshing}
                >
                    <ArrowPathIcon className={`h-5 w-5 ml-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>
            <div className="grid grid-cols-4 gap-2 my-4 flex-grow overflow-y-auto">
                {ownedColors.map((color, index) => (
                    <div
                        key={index}
                        className="w-full aspect-square rounded cursor-pointer"
                        style={{ backgroundColor: color.color }}
                        title={color.color}
                        onClick={() => handleColorBoxClick(color.color)}
                    ></div>
                ))}
                <div
                    className="w-full aspect-square rounded cursor-pointer border-2 border-white/80 border-dashed flex items-center justify-center text-white/80 hover:bg-white/20"
                    onClick={() => setIsColorMinterOpen(true)}
                >
                    <PlusIcon className='h-8 w-8' />
                </div>
            </div>
            <div className="flex justify-start items-center">
                <h2 className="text-xl font-semibold text-white mr-2">Make it a Gradient</h2>
                <Toggle isOn={isGradientMode} onToggle={toggleGradientMode} />
            </div>
            {isGradientMode && (
                <div className="mt-2">
                    <p className="text-gray-600 text-xs">Click on two colors above to make a gradient</p>
                    <p className="text-white mb-2 text-sm">Selected Colors:</p>
                    <div className="flex">
                        <div
                            className="w-10 h-10 border border-gray-300 rounded"
                            style={{ backgroundColor: primaryColor || 'transparent' }}
                        ></div>
                        <div
                            className="w-10 h-10 border border-gray-300 ml-2 rounded"
                            style={{ backgroundColor: secondaryColor || 'transparent' }}
                        ></div>
                    </div>
                </div>
            )}
            <div className="flex justify-start items-center">
                <h2 className="text-xl font-semibold text-white mr-2">Set Background Color</h2>
                <Toggle isOn={isBGMode} onToggle={toggleBGMode} />
            </div>
            <button
                onClick={() => setIsColorMinterOpen(true)}
                className=" text-white text-xs mt-6"
            >
                Need more? Mint a New Color
            </button>
            <ColorMinter
                isOpen={isColorMinterOpen}
                onClose={() => {
                    address && fetchOwnedColors(address)
                    setIsColorMinterOpen(false)
                }}
                colorCheckerContract={colorCheckerContract}
            />
        </div>
    );
};

export default OwnedColors;