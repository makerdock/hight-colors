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
        mintError,
        primaryColor, isBGMode, invertMode,
        setSidebarMode,
        fetchOwnedArrows
    } = useColorStore();
    const { writeContractAsync } = useWriteContract()
    const account = useAccount()

    const mintArrowWithHigher = async () => {
        if (typeof window.ethereum === 'undefined') {
            return;
        }

        const currChainId = account.chainId;
        if (currChainId !== base.id) {
            // await switchChain(wagmiCoreConfig, { chainId: base.id });

            const walletClient = createWalletClient({
                chain: base,
                transport: custom(window.ethereum),
            })

            await walletClient.switchChain({ id: base.id })
        }

        // const contractAddress = ;


        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const nftContractAddress = env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
        const higherTokenAddress = env.NEXT_PUBLIC_ALT_PAYMENT_CONTRACT_ADDRESS;

        const nftContract = new ethers.Contract(nftContractAddress, higherArrowNftAbi, signer);

        const higherTokenContract = new ethers.Contract(higherTokenAddress, [
            'function approve(address spender, uint256 amount) public returns (bool)',
            'function allowance(address owner, address spender) public view returns (uint256)'
        ], signer);

        // set({ sidebarMode: "loading" });
        setSidebarMode("loading");
        try {
            // Check current allowance
            // const userAddress = await signer.getAddress();
            const currentAllowance = await higherTokenContract.allowance(account.address, nftContractAddress);
            const requiredAmount = ethers.utils.parseUnits("100", 18); // Assuming 18 decimals for Higher token

            // If current allowance is less than required, approve the NFT contract to spend Higher tokens
            if (currentAllowance.lt(requiredAmount)) {
                console.log('Approving Higher token spend...');
                const approvalTx = await higherTokenContract.approve(nftContractAddress, requiredAmount);
                await approvalTx.wait();
                console.log('Approval successful');
            }

            console.log('Minting NFT with Higher token...');
            const transaction = await nftContract.mintWithHigher(primaryColor, isBGMode, invertMode);

            console.log('Transaction sent. Waiting for confirmation...');
            const receipt = await transaction.wait();

            const transactionHash = receipt.transactionHash;
            console.log("🚀 ~ mintArrow: ~ receipt:", receipt)
            console.log('NFT minted successfully!');
            console.log('Transaction Hash:', transactionHash);

            const etherscanLink = `https://basescan.org/tx/${transactionHash}`;
            console.log('Basescan Link:', etherscanLink);

            // Find the Transfer event in the logs
            const transferLog = receipt.logs.find((log: any) => {
                try {
                    const parsedLog = new ethers.utils.Interface(higherArrowNftAbi).parseLog(log);
                    return parsedLog.name === 'Transfer' && parsedLog.args.from === ethers.constants.AddressZero;
                } catch {
                    return false;
                }
            });

            if (!transferLog) {
                throw new Error('No mint Transfer event found in the transaction');
            }

            // Parse the Transfer event to get the contract address and token ID
            const parsedTransferLog = new ethers.utils.Interface(higherArrowNftAbi).parseLog(transferLog);
            const tokenId = parsedTransferLog.args.tokenId;
            console.log("🚀 ~ mintArrow: ~ tokenId:", tokenId)

            // Get the token URI
            const tokenURI = await nftContract.tokenURI(tokenId);
            console.log("🚀 ~ mintArrow: ~ tokenURI:", tokenURI)

            // fetch the json from the uri
            const tokenData = await fetch(tokenURI).then(a => a.json());
            console.log("🚀 ~ mintArrow: ~ tokenData:", tokenData)

            await fetchOwnedArrows(account.address as any);
            setSidebarMode("success");
        } catch (error) {
            console.error(error);
            setSidebarMode("mint");

            toast({
                variant: "destructive",
                title: 'Something went wrong.',
                description: 'Could not mint NFT, please try again later.'
            });
        }
    }


    const mintArrow = async () => {
        const currChainId = account.chainId;
        if (currChainId !== base.id) {
            // await switchChain(wagmiCoreConfig, { chainId: base.id });

            const walletClient = createWalletClient({
                chain: base,
                transport: custom(window.ethereum),
            })

            await walletClient.switchChain({ id: base.id })
        }

        const contractAddress = env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

        setSidebarMode("loading");
        try {

            console.log("🚀 ~ mintArrow: ~ contractAddress:", contractAddress)
            const { request } = await simulateContract(wagmiCoreConfig as any, {
                address: contractAddress as any,
                functionName: 'mint',
                abi: higherArrowNftAbi,
                args: [primaryColor, isBGMode, invertMode],
            })
            const hash = await writeContractAsync(request)
            console.log("🚀 ~ mintArrow ~ hash:", hash)

            if (!hash) {
                throw new Error('Transaction failed');
            }

            const receipt = await waitForTransactionReceipt(wagmiCoreConfig as any, { hash });
            console.log('NFT minted successfully!');
            console.log('Transaction Hash:', receipt.transactionHash);

            const etherscanLink = `https://basescan.org/tx/${receipt.transactionHash}`;
            console.log('Basescan Link:', etherscanLink);

            await fetchOwnedArrows(account.address as any);
            setSidebarMode("success");
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
