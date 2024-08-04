import { ArrowPathIcon, PlusIcon, XMarkIcon } from '@heroicons/react/16/solid';
import classNames from 'classnames';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import useColorStore from '~/stores/useColorStore';
import { higherArrowNftAbi } from '~/utils/abi';
import { ColorArrowNftAbi } from '~/utils/ColorArrowNFTABI';
import ColorMinter from './ColorMinter';
import Toggle from './Toggle';

interface ColorNFT {
    color: string;
}

interface OwnedColorsProps {
    onColorSelect: (color: string, isGradient: boolean, isBGMode: boolean, invertMode: boolean) => void;
}

const OwnedColors: React.FC<OwnedColorsProps> = ({ }) => {
    const { address } = useAccount();
    const [ownedColors, setOwnedColors] = useState<ColorNFT[]>([]);
    const {
        primaryColor, setPrimaryColor,
        secondaryColor, setSecondaryColor,
        isGradientMode, setIsGradientMode,
        isBGMode,
        setIsBGMode, invertMode, setInvertMode
    } = useColorStore();
    const [isColorMinterOpen, setIsColorMinterOpen] = useState(false);
    const [isFetching, setIsFetching] = useState<boolean>(true)
    // const [isRefreshing, setIsRefreshing] = useState(false);
    const [colorCheckerContract, setColorCheckerContract] = useState<ethers.Contract | null>(null);
    // const [activeTab, setActiveTab] = useState<'arrow' | 'background'>('arrow');
    // const [isInvert, setIsInvert] = useState(false)
    const [isMinting, setIsMinting] = useState(false);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [etherscanLink, setEtherscanLink] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    useEffect(() => {
        if (!primaryColor && !isFetching) {
            if (ownedColors.length > 0) {
                setPrimaryColor(ownedColors[0]?.color);
            }
        }

    }, [ownedColors, isFetching])

    const handleRefresh = () => {
        if (address) {
            fetchOwnedColors(address);
        }
    };

    const fetchOwnedColors = async (ownerAddress: string) => {
        setIsFetching(true);
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
            setIsFetching(false);
        }
    };

    const isGradientDisabled = ownedColors.length < 2;

    useEffect(() => {
        if (isGradientDisabled && isGradientMode) {
            setIsGradientMode(false);
            setSecondaryColor(undefined);
        }
    }, [isGradientDisabled, isGradientMode]);

    const handleColorBoxClick = (color: string) => {
        // if (primaryColor === color && !isGradientMode) {
        //     setPrimaryColor(undefined);
        //     setSecondaryColor(undefined);
        //     return;
        // }
        if (isGradientMode) {
            if (!primaryColor) {
                setPrimaryColor(color);
            } else if (!secondaryColor) {
                setSecondaryColor(color);
            } else {
                setPrimaryColor(color);
                setSecondaryColor(undefined);
            }
        } else {
            setPrimaryColor(color);
            setSecondaryColor(color);
        }
    };

    const toggleGradientMode = () => {
        if (!isGradientDisabled) {
            setIsGradientMode(!isGradientMode);

            if (!isGradientMode) {
                const defaultSecondaryColor = ownedColors.filter(a => a.color !== primaryColor)[0]
                if (defaultSecondaryColor) {
                    setSecondaryColor(defaultSecondaryColor.color);
                }

            } else {
                setSecondaryColor(undefined);
            }
        }
    };

    const toggleInvert = () => {
        setIsBGMode(!isBGMode)
    };

    const toggleColorMinter = () => {
        setIsColorMinterOpen(!isColorMinterOpen);
    };

    const mintArrow = async (): Promise<void> => {
        if (typeof window.ethereum === 'undefined') {
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contractAddress = '0x773b41E13B9c5C306f1639928E2b544589238A9F';
        const mintContract = new ethers.Contract(contractAddress, higherArrowNftAbi, signer);

        setIsMinting(true);
        try {
            const transaction = await mintContract.mint(primaryColor, secondaryColor, isBGMode, invertMode);

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

    const renderColorPickers = () => (
        <>
            <div className="grid md:grid-cols-4 xs:grid-cols-8 grid-cols-6 gap-3 my-2 py-1">
                {ownedColors.map((nft, index) => (
                    <div
                        key={index}
                        className={classNames(
                            "w-full aspect-square rounded cursor-pointer",
                            [primaryColor, secondaryColor].includes(nft.color) && "ring-2 ring-black/40 ring-offset-2"

                        )}
                        style={{ backgroundColor: nft.color }}
                        title={nft.color}
                        onClick={() => handleColorBoxClick(nft.color)}
                    ></div>
                ))}
            </div>
            <div
                className="w-full flex-1 p-1 rounded cursor-pointer border-2 border-black/40 border-dashed flex items-center justify-center text-black/40 hover:bg-white/80 mb-4"
                onClick={() => setIsColorMinterOpen(true)}
            >
                {isColorMinterOpen ? (
                    <div className='flex items-center justify-between space-x-2 w-full'>
                        <ColorMinter colorCheckerContract={colorCheckerContract} />
                        <button
                            onClick={e => {
                                e.stopPropagation()
                                setIsColorMinterOpen(false)
                            }}
                            className=' hover:bg-gray-200 flex-shrink rounded-full transition-colors'
                        >
                            <XMarkIcon className='h-4 w-4  text-gray-400' /> {/* Increased size for better visibility */}
                        </button>
                    </div>
                ) : (
                    <PlusIcon className='h-8 w-8' />
                )}
            </div>
            {/* <div className='text-red-500'>This is a error</div> */}
            <div>
                {/* <div className="flex justify-start items-start mt-4 space-x-2"> */}
                <div className="flex justify-start items-center mt-4">
                    <h2 className="text-lg font-semibold text-black mr-2 flex-grow">Gradient</h2>
                    <Toggle isOn={isGradientMode} onToggle={toggleGradientMode} disabled={isGradientDisabled} />
                </div>
                {isGradientMode && !isGradientDisabled && <p className="text-gray-400 transition-all duration-300 ease-in-out text-xs">Click on two colors above to make a gradient</p>}
                {isGradientDisabled && (
                    <p className="text-red-500 text-xs mt-1">Get more colors to try gradient</p>
                )}
            </div>
            {isGradientMode && <div
                style={{
                    background: secondaryColor
                        ? `linear-gradient(to right, ${primaryColor || '#ffffff'}, ${secondaryColor})`
                        : primaryColor || '#ffffff',
                }}
                className={classNames(
                    'h-1 mt-1 rounded-xl transition-all duration-300 ease-in-out',
                    isGradientMode ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0',
                    (primaryColor && secondaryColor) ? 'w-full' : 'w-0'
                )}
            />}

            <div className="flex justify-start items-center mt-4">
                <h2 className="text-lg font-semibold text-black mr-2 flex-grow">Invert</h2>
                <Toggle isOn={isBGMode} onToggle={toggleInvert} />
            </div>
            <div className=' grid grid-cols-2 gap-2 h-8 mt-4'>
                {['#ffffff', '#000000'].map((color, index) => (
                    <div
                        key={index}
                        className={classNames(
                            "w-full rounded cursor-pointer border border-gray-300",
                            (!invertMode && color === '#ffffff' || !!invertMode && color === '#000000') && "ring-2 ring-black/40 ring-offset-2"

                        )}
                        style={{ backgroundColor: color }}
                        title={color}
                        onClick={() => setInvertMode(color !== '#ffffff')}
                    ></div>
                ))}
            </div>
        </>
    );

    return (

        <div className="p-4 md:p-8 bg-white min-h-[60vh] flex flex-col w-full">
            {/* {isColorMinterOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={toggleColorMinter}></div>
            )} */}
            {/* <h1 className="text-3xl mb-8 md:text-4xl font-bold text-white lg:mb-4">Higher Colors</h1> */}
            <div className="flex justify-start items-center">
                <h2 className="text-lg font-semibold text-black">BaseColors</h2>
                <button
                    onClick={handleRefresh}
                    className="text-gray-400 hover:text-gray-800 transition-colors"
                    disabled={isFetching}
                >
                    <ArrowPathIcon className={`h-5 w-5 ml-3 ${isFetching ? 'animate-spin' : ''}`} />
                </button>
            </div>
            {renderColorPickers()}
            <div className='mt-6 w-full'>
                <button className='px-4 py-2 bg-white text-black font-medium w-full
                rounded-full hover:bg-black hover:text-white border-black border transition-colors duration-200'
                    onClick={mintArrow}
                    disabled={isMinting}>
                    {isMinting ? 'Minting...' : 'Mint'}
                </button>
            </div>
            {transactionHash && etherscanLink && (
                <div className="mt-4">
                    <a href={etherscanLink} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                        View on Basescan
                    </a>
                </div>
            )}
        </div>
    );
};

export default OwnedColors;