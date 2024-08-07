"use client"

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import useColorStore from "~/stores/useColorStore"
import ShineBorder from "./magicui/shine-border"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "./ui/dropdown-menu"
import { wagmiCoreConfig } from '~/utils/rainbowConfig'
// import { useAccount, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { simulateContract, switchChain, waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { base } from 'wagmi/chains'
import { env } from "~/env"
import { higherArrowNftAbi } from "~/utils/abi"
import { toast } from "./ui/use-toast"
import { useAccount, useChainId, useSimulateContract, useWriteContract } from "wagmi"
import { ethers } from "ethers"
import { createWalletClient, custom } from "viem"

export function PaymentCta() {
    const {
        mintError, mintArrowWithHigher,
        primaryColor, isBGMode, invertMode,
        setSidebarMode
    } = useColorStore();
    const { writeContractAsync } = useWriteContract()
    const account = useAccount()


    const mintArrow = async () => {
        const currChainId = account.chainId;
        if (currChainId !== base.id) {
            // await switchChain(wagmiCoreConfig, { chainId: base.id });

            const walletClient = createWalletClient({
                chain: base,
                transport: custom(window.ethereum!),
            })

            await walletClient.switchChain({ id: base.id })
            toast({
                variant: "destructive",
                title: 'Please switch to Base Mainnet to mint NFTs.'
            });
            return;
        }

        const contractAddress = env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

        setSidebarMode("loading");
        try {

            console.log("🚀 ~ mintArrow: ~ contractAddress:", contractAddress)
            const { request } = await simulateContract(wagmiCoreConfig, {
                address: contractAddress as any,
                functionName: 'mint',
                abi: higherArrowNftAbi,
                args: [primaryColor, isBGMode, invertMode],
            })
            const hash = await writeContractAsync(request)
            console.log("🚀 ~ mintArrow ~ hash:", hash)

            if (hash) {
                const receipt = await waitForTransactionReceipt(wagmiCoreConfig, { hash });
                console.log('NFT minted successfully!');
                console.log('Transaction Hash:', receipt.transactionHash);

                const etherscanLink = `https://basescan.org/tx/${receipt.transactionHash}`;
                console.log('Basescan Link:', etherscanLink);

                // set({ sidebarMode: "success" });
                setSidebarMode("success");
            }
        } catch (error) {
            console.error(error);
            // set({ sidebarMode: "mint" });
            setSidebarMode("mint");

            toast({
                variant: "destructive",
                title: 'Something went wrong.',
                description: 'Could not mint NFT, please try again later.'
            });
        }
    }
    return (
        <>

            <DropdownMenu>
                <DropdownMenuTrigger className="hover:outline-none focus:outline-none">
                    <ShineBorder
                        className="text-center text-sm font-bold uppercase w-full tracking-widest shadow-lg cursor-pointer"
                        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                        borderWidth={2}
                    >
                        <span>Mint</span>
                    </ShineBorder>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={mintArrow}
                    >Pay with 0.004 Eth</DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={mintArrowWithHigher}
                    >Pay with 100 $HIGHER</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {/* {!!mintError?.length && <div className="text-red-500 text-sm font-medium mt-1">{mintError}</div>} */}
        </>

    )
}
