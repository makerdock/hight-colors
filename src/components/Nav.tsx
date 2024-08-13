import {
    useAccountModal,
    useConnectModal
} from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import classnames from "classnames"
import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";

const Nav = () => {
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { address } = useAccount();

    const walletFormat = (address: string, chars = 4) => {
        return `${address.slice(0, chars)}...${address.slice(-chars)}`;
    };

    const buttonClasses = "px-4 py-2 bg-white text-black font-medium rounded-full hover:bg-black hover:text-white transition-colors duration-200";

    return (
        <>
            <nav className="flex justify-center py-6 fixed top-0 left-0 w-full z-30">
                {!!address && (
                    <div className={classnames("backdrop-blur-md bg-white/30 rounded-full shadow-lg", "invisible sm:visible")}>
                        <button onClick={openAccountModal} className={classnames(buttonClasses)}>
                            {walletFormat(address)}
                        </button>
                    </div>
                )}

                {!address && (
                    <div className={classnames("backdrop-blur-md bg-white/30 rounded-full shadow-lg")}>
                        <button onClick={openConnectModal} className={buttonClasses}>
                            Connect Wallet
                        </button>
                    </div>
                )}

            </nav>
            {!!address && (
                <Button variant={"ghost"} onClick={openAccountModal} className={classnames("md:invisible visible absolute top-2 right-2 ml-auto z-50 shadow-lg border border-gray-200 text-gray-600 rounded-full cursor-pointer")}>
                    <LogOutIcon className="h-4 w-4" />
                </Button>
            )}
        </>
    );
};

export default Nav;