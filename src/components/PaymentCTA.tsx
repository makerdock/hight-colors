"use client"


import useColorStore from "~/stores/useColorStore"
import { wagmiCoreConfig } from '~/utils/rainbowConfig'
import ShineBorder from "./magicui/shine-border"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "./ui/dropdown-menu"
// import { useAccount, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { readContract, simulateContract, waitForTransactionReceipt } from '@wagmi/core'
import { createWalletClient, custom, decodeEventLog, formatEther } from "viem"
import { useAccount, useWriteContract } from "wagmi"
import { base } from 'wagmi/chains'
import { env } from "~/env"
import { higherArrowNftAbi } from "~/utils/abi"
import { toast } from "./ui/use-toast"
import { useEffect, useState } from "react"

const nftContractAddress = env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
const higherTokenAddress = env.NEXT_PUBLIC_ALT_PAYMENT_CONTRACT_ADDRESS;


export function PaymentCta() {
    const {
        mintError,
        primaryColor, isBGMode, invertMode,
        setSidebarMode,
        fetchOwnedArrows
    } = useColorStore();
    const { writeContractAsync } = useWriteContract()
    const account = useAccount()
    const [balance, setBalance] = useState<bigint | null>(null);

    const getTokenUriFromHash = async (hash: string) => {

        const receipt = await waitForTransactionReceipt(wagmiCoreConfig as any, { hash: hash as any });

        if (!receipt) {
            throw new Error('Transaction failed');
        }

        // Find the Transfer event in the logs
        const transferLog = receipt.logs.find((log) => {
            try {
                const event = decodeEventLog({
                    abi: higherArrowNftAbi,
                    data: log.data,
                    topics: log.topics,
                })
                return event.eventName === 'Transfer' && (event.args as any)?.from === '0x0000000000000000000000000000000000000000'
            } catch {
                return false
            }
        })

        if (!transferLog) {
            throw new Error('No mint Transfer event found in the transaction')
        }

        // Parse the Transfer event to get the token ID
        const event = decodeEventLog({
            abi: higherArrowNftAbi,
            data: transferLog.data,
            topics: transferLog.topics,
        })
        const tokenId: number = (event.args as any)?.tokenId

        console.log("🚀 ~ getTokenUriFromHash: ~ tokenId:", tokenId)

        // Get the token URI
        const tokenURI = await readContract(wagmiCoreConfig as any, {
            address: nftContractAddress as any,
            abi: higherArrowNftAbi,
            functionName: 'tokenURI',
            args: [tokenId],
        })

        console.log("🚀 ~ getTokenUriFromHash: ~ tokenURI:", tokenURI)

        if (!tokenURI) {
            throw new Error('Failed to fetch token URI')
        }

        // Fetch the JSON from the URI
        const tokenData = await fetch(tokenURI as string).then(response => response.json())
        console.log("🚀 ~ getTokenUriFromHash: ~ tokenData:", tokenData)

        return { tokenId, tokenURI, tokenData }
    }

    const mintArrowWithHigher = async () => {
        const chainId = account.chainId
        if (chainId !== base.id) {
            // await switchNetwork?.(base.id)
        }

        setSidebarMode("loading")

        try {
            // Check Higher token balance
            const balance = await readContract(wagmiCoreConfig as any, {
                address: higherTokenAddress as any,
                abi: [{
                    inputs: [{ name: 'account', type: 'address' }],
                    name: 'balanceOf',
                    outputs: [{ name: '', type: 'uint256' }],
                    stateMutability: 'view',
                    type: 'function'
                }],
                functionName: 'balanceOf',
                args: [account.address as any],
            })

            // Check mint price
            const mintPrice = await readContract(wagmiCoreConfig as any, {
                address: nftContractAddress as any,
                abi: higherArrowNftAbi,
                functionName: 'higherMintPrice',
            }) as bigint;

            if (balance < mintPrice) {
                throw new Error(`Insufficient Higher token balance. You need ${formatEther(mintPrice)} HIGHER tokens.`)
            }


            const allowance = await readContract(wagmiCoreConfig as any,
                {
                    address: higherTokenAddress as any,
                    abi: [
                        {
                            inputs: [
                                { name: 'owner', type: 'address' },
                                { name: 'spender', type: 'address' }
                            ],
                            name: 'allowance',
                            outputs: [{ name: '', type: 'uint256' }],
                            stateMutability: 'view',
                            type: 'function'
                        }
                    ],
                    functionName: 'allowance',
                    args: [account.address as any, nftContractAddress as any],
                }
            )




            console.log("allowance", allowance)


            if (allowance < mintPrice) {
                // Approve Higher tokens
                const approveHash = await writeContractAsync({
                    address: higherTokenAddress as any,
                    abi: [{
                        inputs: [
                            { name: 'spender', type: 'address' },
                            { name: 'amount', type: 'uint256' }
                        ],
                        name: 'approve',
                        outputs: [{ name: '', type: 'bool' }],
                        stateMutability: 'nonpayable',
                        type: 'function'
                    }],
                    functionName: 'approve',
                    args: [nftContractAddress as any, mintPrice],
                })
            }

            console.log("🚀 ~ mintArrowWithHigher ~ primaryColor, isBGMode, invertMode:", primaryColor, isBGMode, invertMode)

            // Mint NFT with Higher tokens
            const mintHash = await writeContractAsync({
                address: nftContractAddress as any,
                abi: higherArrowNftAbi,
                functionName: 'mintWithHigher',
                args: [primaryColor, isBGMode, invertMode],
                gas: 2000000n
            })
            console.log("🚀 ~ mintArrowWithHigher ~ mintHash:", mintHash)


            await getTokenUriFromHash(mintHash)

            await fetchOwnedArrows(account.address as any)
            setSidebarMode("success")
        } catch (error) {
            console.error(error)
            setSidebarMode("mint")

            toast({
                variant: "destructive",
                title: 'Something went wrong.',
                description: (error as any).message || 'Could not mint NFT, please try again later.'
            })
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
            console.log("🚀 ~ mintArrow ~ receipt:", receipt)
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

    const higherBalance = async (ownerAddress: string | undefined) => {
        try {
            const balance = await readContract(wagmiCoreConfig as any, {
                address: higherTokenAddress as any,
                abi: [{
                    inputs: [{ name: 'account', type: 'address' }],
                    name: 'balanceOf',
                    outputs: [{ name: '', type: 'uint256' }],
                    stateMutability: 'view',
                    type: 'function'
                }],
                functionName: 'balanceOf',
                args: [ownerAddress as any],
            })
            setBalance(BigInt(balance));
        } catch (error) {
            console.error('Error fetching balance:', error);
            setBalance(null);
        }
    }

    const formatBalance = (balanceBigInt: bigint | null): string => {
        if (balanceBigInt === null) return 'N/A';
        return balanceBigInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const renderBalanceMessage = () => {
        if (balance === null) {
            return;
        }

        if (balance < BigInt(100)) {
            return (
                <div className='text-center items-center'>
                    <p className='text-xs text-slate-600 text-center'>Your Balance: {formatBalance(balance)} $Higher</p>
                    <p className='text-xs text-slate-600 text-center'> <a href="https://www.buysomehigher.com/" target="_blank"
                        rel="noopener noreferrer" className="text-blue-500 hover:underline">Feeling low? Get Higher</a></p>
                </div>
            );
        }
        return <p className='text-xs text-slate-600'>Your Balance: {formatBalance(balance)} $Higher</p>;
    };

    useEffect(() => {
        higherBalance(account.address);
    }, [account.address]);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="hover:outline-none focus:outline-none">
                    <ShineBorder
                        className="text-center text-sm font-bold mb-2 uppercase w-full tracking-widest shadow-lg cursor-pointer"
                        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                        borderWidth={2}
                    >
                        <span>Mint</span>
                    </ShineBorder>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={mintArrow}
                    >Pay with 0.0004 Eth</DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={mintArrowWithHigher}
                    >Pay with 100 $HIGHER</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {renderBalanceMessage()}
            <span className=" text-slate-600 text-center text-base font-bold mt-4"> 10/ 1000 Mints</span>
            {/* {!!mintError?.length && <div className="text-red-500 text-sm font-medium mt-1">{mintError}</div>} */}
        </>

    )
}
