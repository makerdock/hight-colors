import { ArrowPathIcon } from '@heroicons/react/16/solid';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { env } from '~/env';
import useColorStore from '~/stores/useColorStore';
import { AlchemyResponse } from '~/utils/alchemyResponse';
import { PaymentCta } from './PaymentCTA';
import Toggle from './Toggle';

interface ColorNFT {
    color: string;
}

interface WelcomeSidebarProps {
    // onColorSelect: (color: string, isGradient: boolean, isBGMode: boolean, invertMode: boolean) => void;
}

const WelcomeSidebar: React.FC<WelcomeSidebarProps> = ({ }) => {
    const { address } = useAccount();

    const {
    } = useColorStore();

    return (
        <div className="p-4 md:p-8 bg-white md:min-h-full min-h-max flex flex-col w-full">
            <div className="flex-1 mb-6">
                <div className="mb-1">
                    <div className="flex justify-start items-center">
                        <h2 className="text-3xl font-semibold text-black flex-1 mb-2">Base Names</h2>
                    </div>
                    <p className='text-sm text-slate-600'>
                        Mint phrases that are unique to you and color them with your favorite colors.
                    </p>
                </div>

            </div>
            <div className="sticky bottom-0 flex-col items-stretch">
                <PaymentCta />
            </div>
        </div>
    );
};

export default WelcomeSidebar;