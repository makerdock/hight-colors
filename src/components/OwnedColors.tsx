import { ArrowPathIcon } from '@heroicons/react/16/solid';
import classNames from 'classnames';
import { ethers } from 'ethers';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { env } from '~/env';
import useColorStore from '~/stores/useColorStore';
import { AlchemyResponse } from '~/utils/alchemyResponse';
import Toggle from './Toggle';
import { PaymentCta } from './PaymentCTA';
import { wagmiCoreConfig } from '~/utils/rainbowConfig'
import { readContract } from '@wagmi/core'
import { higherArrowNftAbi } from '~/utils/abi';

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
    const [isFetching, setIsFetching] = useState<boolean>(true)


    useEffect(() => {
        if (address) {
            fetchOwnedColors(address);
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
            const response = await fetch(`/api/getColors?ownerAddress=${ownerAddress}&contractAddress=${env.NEXT_PUBLIC_BASECOLOR_CONTRACT_ADDRESS}`);
            if (!response.ok) {
                throw new Error('Failed to fetch NFTs');
            }
            const data: AlchemyResponse = await response.json();
            const colors = data.ownedNfts.map((nft) => ({
                color: nft.raw.metadata.name
            }));
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



    const renderColorPickers = () => (
        <>
            <div className={classNames("relative", ownedColors.length > 8 && 'h-20 md:h-40')}>
                {ownedColors.length > 8 &&
                    <div className="absolute bottom-0 w-full h-10 left-0 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>}

                <div className={classNames(
                    "grid md:grid-cols-4 xs:grid-cols-8 grid-cols-6 gap-3 gap-y-4 my-2 py-1 p-1 relative",
                    ownedColors.length > 8 && 'h-20 md:h-40 overflow-y-scroll pb-6'
                )}>
                    {ownedColors.map((nft, index) => (
                        <div
                            key={index}
                            className={classNames(
                                "w-full aspect-square rounded cursor-pointer",
                                [primaryColor, secondaryColor].includes(nft.color) && "ring-2 ring-black/20 ring-offset-2"

                            )}
                            style={{ backgroundColor: nft.color }}
                            title={nft.color}
                            onClick={() => handleColorBoxClick(nft.color)}
                        ></div>
                    ))}

                    {isFetching && !ownedColors.length && new Array(3).fill(null).map((_, index) => <div key={index} className='animate-pulse bg-slate-200 aspect-square rounded' />)}
                    {/* <AnimatePresence>
                    {!isFetching && <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="w-full col-span-full row-span-1 col-start-1 flex-1 overflow-hidden p-1"
                    >
                        {/* <ColorMinter
                            onClose={() => {
                                address && fetchOwnedColors(address)
                            }}
                            colorCheckerContract={colorCheckerContract} /> */}
                    {/* </motion.div>}
                </AnimatePresence> */}
                </div>
            </div>
        </>
    );

    return (

        <div className="p-4 md:p-8 bg-white md:min-h-full min-h-max flex flex-col w-full">
            <div className="flex-1 mb-6">
                <div className="mb-1">
                    <div className="flex justify-start items-center">
                        <h2 className="text-xl font-semibold text-black flex-1">Base Colors</h2>
                        <button
                            onClick={handleRefresh}
                            className="text-slate-400 hover:text-slate-800 transition-colors"
                            disabled={isFetching}
                        >
                            <ArrowPathIcon className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <p className='text-sm text-slate-600'>
                        Mint your own Higher Arrows with the colors you own
                    </p>
                </div>
                {renderColorPickers()}
                <a href='https://www.basecolors.com/' target="_blank"
                    rel="noopener noreferrer" className="text-gray-500 text-xs underline"> Get more Base Colors</a>
                <div className="flex justify-start items-center mt-4">
                    <h2 className="text-lg font-semibold text-black mr-2 flex-grow">Invert</h2>
                    <Toggle isOn={isBGMode} onToggle={toggleInvert} />
                </div>
                <div className=' grid grid-cols-2 gap-2 h-8 mt-4'>
                    {['#ffffff', '#000000'].map((color, index) => (
                        <div
                            key={index}
                            className={classNames(
                                "w-full rounded cursor-pointer border border-slate-300",
                                (!invertMode && color === '#ffffff' || !!invertMode && color === '#000000') && "ring-2 ring-black/40 ring-offset-2"

                            )}
                            style={{ backgroundColor: color }}
                            title={color}
                            onClick={() => setInvertMode(color !== '#ffffff')}
                        ></div>
                    ))}
                </div>
            </div>
            <div className="sticky bottom-0 flex-col items-stretch">
                <PaymentCta />
            </div>
        </div>
    );
};

export default OwnedColors;