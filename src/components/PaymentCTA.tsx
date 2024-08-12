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
import { chains, createSession, currencies, executeSession } from "@paywithglide/glide-js"
import { getBalance, readContract, simulateContract, waitForTransactionReceipt } from '@wagmi/core'
import { useEffect, useState } from "react"
import { createWalletClient, custom, decodeEventLog, formatEther } from "viem"
import { useAccount, useChainId, useReadContract, useSendTransaction, useSignTypedData, useSwitchChain, useWriteContract } from "wagmi"
import { base } from 'wagmi/chains'
import { env } from "~/env"
import { higherArrowNftAbi } from "~/utils/abi"
import { glideConfig } from "~/utils/glideConfig"
import { toast } from "./ui/use-toast"
import CountdownTimer from "./CountdownTimer"

const nftContractAddress = env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
const higherTokenAddress = env.NEXT_PUBLIC_ALT_PAYMENT_CONTRACT_ADDRESS;


export function PaymentCta() {
    const {
        mintError,
        primaryColor, isBGMode, invertMode,
        setSidebarMode,
        fetchOwnedArrows,
        setMintedNftMetadata
    } = useColorStore();
    const { writeContractAsync } = useWriteContract()
    const account = useAccount()
    const [balance, setBalance] = useState<bigint | null>(null);


    const { data: totalSupply = 0, isError, isLoading } = useReadContract({
        address: nftContractAddress as any,
        abi: higherArrowNftAbi,
        functionName: 'totalSupply',
    })
    // const mintPrice = await readContract(wagmiCoreConfig as any, ) as bigint
    // const { data: mintPrice = BigInt(0) } = useReadContract({
    //     address: nftContractAddress as any,
    //     abi: higherArrowNftAbi,
    //     functionName: 'ethMintPrice',
    // })
    console.log("🚀 ~ PaymentCta ~ totalSupply:", totalSupply)

    const currentChainId = useChainId();
    const { switchChainAsync } = useSwitchChain();
    const { sendTransactionAsync } = useSendTransaction();
    const { signTypedDataAsync } = useSignTypedData();


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
        try {

            const mintPrice = await readContract(wagmiCoreConfig as any, {
                address: nftContractAddress as any,
                abi: higherArrowNftAbi,
                functionName: 'mintPrice',
            }) as bigint

            // const ethMintPriceInEth = formatEther(mintPrice)

            const sessionOptions = {
                account: account.address,

                // Optional. Setting this restricts the user to only
                // pay with the specified currency.
                paymentCurrency: currencies.higher.on(chains.base),

                chainId: chains.base.id,
                address: env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as any,
                abi: higherArrowNftAbi,
                functionName: "mintFor",
                args: [account.address, primaryColor, isBGMode, invertMode],
                value: mintPrice as bigint,
            }
            console.log("🚀 ~ mintArrowWithHigher ~ sessionOptions:", sessionOptions)

            const session = await createSession(glideConfig, sessionOptions);

            const transactionHash = await executeSession(glideConfig, {
                session,
                currentChainId: currentChainId as any,
                switchChainAsync,
                sendTransactionAsync,
                signTypedDataAsync,
            });

            const tokenDataRes = await getTokenUriFromHash(transactionHash.sponsoredTransactionHash)

            setMintedNftMetadata(tokenDataRes.tokenData)

            await fetchOwnedArrows(account.address as any);
            setSidebarMode("success");
        } catch (error) {
            console.error('Error minting with $HIGHER:', error);
        }
    }

    // const mintArrowWithHigher = async () => {
    //     const chainId = account.chainId
    //     if (chainId !== base.id) {
    //         // await switchNetwork?.(base.id)
    //     }

    //     setSidebarMode("loading")

    //     try {
    //         // Check Higher token balance
    //         const balance = await readContract(wagmiCoreConfig as any, {
    //             address: higherTokenAddress as any,
    //             abi: [{
    //                 inputs: [{ name: 'account', type: 'address' }],
    //                 name: 'balanceOf',
    //                 outputs: [{ name: '', type: 'uint256' }],
    //                 stateMutability: 'view',
    //                 type: 'function'
    //             }],
    //             functionName: 'balanceOf',
    //             args: [account.address as any],
    //         })

    //         // Check mint price
    //         const mintPrice = await readContract(wagmiCoreConfig as any, {
    //             address: nftContractAddress as any,
    //             abi: higherArrowNftAbi,
    //             functionName: 'higherMintPrice',
    //         }) as bigint;

    //         if (balance < mintPrice) {
    //             throw new Error(`Insufficient Higher token balance. You need ${formatEther(mintPrice)} HIGHER tokens.`)
    //         }


    //         const allowance = await readContract(wagmiCoreConfig as any,
    //             {
    //                 address: higherTokenAddress as any,
    //                 abi: [
    //                     {
    //                         inputs: [
    //                             { name: 'owner', type: 'address' },
    //                             { name: 'spender', type: 'address' }
    //                         ],
    //                         name: 'allowance',
    //                         outputs: [{ name: '', type: 'uint256' }],
    //                         stateMutability: 'view',
    //                         type: 'function'
    //                     }
    //                 ],
    //                 functionName: 'allowance',
    //                 args: [account.address as any, nftContractAddress as any],
    //             }
    //         )




    //         console.log("allowance", allowance)


    //         if (allowance < mintPrice) {
    //             // Approve Higher tokens
    //             const approveHash = await writeContractAsync({
    //                 address: higherTokenAddress as any,
    //                 abi: [{
    //                     inputs: [
    //                         { name: 'spender', type: 'address' },
    //                         { name: 'amount', type: 'uint256' }
    //                     ],
    //                     name: 'approve',
    //                     outputs: [{ name: '', type: 'bool' }],
    //                     stateMutability: 'nonpayable',
    //                     type: 'function'
    //                 }],
    //                 functionName: 'approve',
    //                 args: [nftContractAddress as any, mintPrice],
    //             })
    //             await new Promise((resolve) => setTimeout(resolve, 5000))

    //         }

    //         console.log("🚀 ~ mintArrowWithHigher ~ primaryColor, isBGMode, invertMode:", primaryColor, isBGMode, invertMode)

    //         // delay for 1s

    //         const { request } = await simulateContract(wagmiCoreConfig as any, {
    //             address: nftContractAddress as any,
    //             abi: higherArrowNftAbi,
    //             functionName: 'mintWithHigher',
    //             args: [primaryColor, isBGMode, invertMode],
    //             gas: 2000000n
    //         })

    //         // Mint NFT with Higher tokens
    //         const mintHash = await writeContractAsync(request)
    //         console.log("🚀 ~ mintArrowWithHigher ~ mintHash:", mintHash)


    //         const tokenDataRes = await getTokenUriFromHash(mintHash)
    //         setMintedNftMetadata(tokenDataRes.tokenData)

    //         await fetchOwnedArrows(account.address as any)
    //         setSidebarMode("success")
    //     } catch (error) {
    //         console.error(error)
    //         setSidebarMode("mint")

    //         toast({
    //             variant: "destructive",
    //             title: 'Something went wrong.',
    //             description: (error as any).message || 'Could not mint NFT, please try again later.'
    //         })
    //     }
    // }


    const mintArrow = async () => {
        const currChainId = account.chainId;
        if (currChainId !== base.id) {
            // await switchChain(wagmiCoreConfig, { chainId: base.id });

            const walletClient = createWalletClient({
                chain: base,
                transport: custom((window as any).ethereum),
            })

            await walletClient.switchChain({ id: base.id })
        }


        const mintPrice = await readContract(wagmiCoreConfig as any, {
            address: nftContractAddress as any,
            abi: higherArrowNftAbi,
            functionName: 'mintPrice',
        }) as bigint

        const ethMintPriceInEth = formatEther(mintPrice)
        console.log("ETH Mint price:", ethMintPriceInEth)

        // // Fetch ETH balance
        const balance = await getBalance(wagmiCoreConfig as any, {
            address: account.address as any,
        })

        const balanceInEth = formatEther(balance.value)
        console.log("ETH balance:", balanceInEth)


        if (parseFloat(balanceInEth) < parseFloat(ethMintPriceInEth)) {
            toast({
                variant: "destructive",
                title: 'Insufficient balance',
                description: `You need at least ${formatEther(mintPrice)} ETH to mint an NFT. Your current balance is ${formatEther(balance.value)} ETH.`
            });
            return;
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
                value: mintPrice,
            })
            const hash = await writeContractAsync(request)
            console.log("🚀 ~ mintArrow ~ hash:", hash)

            if (!hash) {
                throw new Error('Transaction failed');
            }

            const tokenDataRes = await getTokenUriFromHash(hash)
            setMintedNftMetadata(tokenDataRes.tokenData)

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

    // const renderBalanceMessage = () => {
    //     if (balance === null) {
    //         return;
    //     }

    //     if (balance < BigInt(100)) {
    //         return (
    //             <div className='text-center items-center'>
    //                 <p className='text-xs text-slate-600 text-center'>Your Balance: {formatBalance(balance)} $Higher</p>
    //                 <p className='text-xs text-slate-600 text-center'> <a href="https://www.buysomehigher.com/" target="_blank"
    //                     rel="noopener noreferrer" className="text-blue-500 hover:underline">Feeling low? Get Higher</a></p>
    //             </div>
    //         );
    //     }
    //     return <p className='text-xs text-slate-600'>Your Balance: {formatBalance(balance)} $Higher</p>;
    // };

    useEffect(() => {
        higherBalance(account.address);
    }, [account.address]);

    return (
        <>
            <div
                onClick={mintArrow}
            >
                <ShineBorder
                    className="text-center text-sm font-bold mb-2 uppercase w-full tracking-widest shadow-lg cursor-pointer flex justify-center items-center space-x-1"
                    color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                    borderWidth={2}
                >
                    <span>Mint for $0.99 (</span>

                    <svg className="h-3 w-3" viewBox="0 0 1001 1001" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1000.59 461.042L945.047 447.301C752.139 399.579 601.533 248.953 553.811 56.0654L540.071 0.523193H461.107L447.367 56.0654C399.645 248.973 249.019 399.579 56.1311 447.301L0.588837 461.042V540.005L56.1311 553.745C249.039 601.467 399.645 752.093 447.367 944.981L461.107 1000.52H540.071L553.811 944.981C601.533 752.073 752.159 601.467 945.047 553.745L1000.59 540.005V461.042ZM765.439 516.784C635.974 534.085 534.13 635.929 516.83 765.394L500.569 887.119L484.308 765.394C467.008 635.929 365.163 534.085 235.698 516.784L113.973 500.523L235.698 484.263C365.163 466.962 467.008 365.118 484.308 235.653L500.569 113.928L516.83 235.653C534.13 365.118 635.974 466.962 765.439 484.263L887.164 500.523L765.439 516.784Z" fill="black" />
                    </svg>

                    <span>350 )</span>
                </ShineBorder>
            </div>
            {/* {renderBalanceMessage()} */}
            <span className=" text-slate-600 text-center align-middle items-center text-base font-bold mt-4">
                {/* {parseInt(totalSupply as any)}/1000 Mints */}
                <CountdownTimer targetDate={'2024-08-17T19:00:00'} />
            </span>
            {/* {!!mintError?.length && <div className="text-red-500 text-sm font-medium mt-1">{mintError}</div>} */}
        </>


    )
}
