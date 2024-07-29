import {
    useConnectModal,
    useAccountModal,
    useChainModal,
} from "@rainbow-me/rainbowkit";
import React from "react";
import { useAccount } from "wagmi";

const Nav = () => {
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { address } = useAccount();

    const walletFormat = (address: string, chars = 4) => {
        return `${address.slice(0, chars)}...${address.slice(-chars)}`;
    };

    const buttonClasses = "px-4 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-400 transition-colors duration-200";

    return (
        <nav className="flex justify-center py-6">
            <div className="backdrop-blur-md bg-white/30 rounded-full shadow-lg">
                {!address && (
                    <button onClick={openConnectModal} className={buttonClasses}>
                        Connect Wallet
                    </button>
                )}
                {!!address && (
                    <button onClick={openAccountModal} className={buttonClasses}>
                        {walletFormat(address)}
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Nav;