import { useConnectModal } from '@rainbow-me/rainbowkit';
import { motion } from "framer-motion";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount, } from 'wagmi';
import { env } from '~/env';
import { AlchemyResponse, OwnedNft } from '~/utils/alchemyResponse';


interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    tokenId: number;
    metadata: Record<string, string>
}

const GetUserNFTsWithMetadata = () => {
    const { address, isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const [nfts, setNfts] = useState<OwnedNft[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOwnedColors = async () => {
        setIsLoading(true);
        try {
            if (!address) return;
            const response = await fetch(`/api/getColors?ownerAddress=${address}&contractAddress=${env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}&limit=8`);

            if (!response.ok) {
                throw new Error('Failed to fetch NFTs');
            }
            const data: AlchemyResponse = await response.json();

            setNfts(data.ownedNfts);
        } catch (error) {
            console.error('Error fetching owned NFTs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOwnedColors();
    }, [address, isConnected]);

    if (!nfts.length) return null;

    return (
        <div className='fixed bottom-0 left-0 pb-4 w-full hidden sm:block '>
            <div className='flex justify-center space-x-2 translate-y-16 opacity-100 group-hover:opacity-0 peer-hover:opacity-0'>
                <span className="uppercase text-sm tracking-widest font-semibold text-slate-600 hover:underline">
                    Your Arrow NFTs
                </span>
            </div>
            <div className='flex justify-center space-x-2'>
                {nfts?.map(({ tokenId, image }) => (
                    <Link href={`/arrow/${tokenId}`} key={tokenId}>
                        <motion.div
                            key={tokenId}
                            initial={{ y: 60 }}
                            animate={{ y: 60 }}
                            whileHover={{ y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="cursor-pointer relative group"
                        >
                            <span className="uppercase text-sm tracking-widest font-semibold text-slate-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                Arrow #{tokenId}
                            </span>
                            <img
                                className="h-24 aspect-square rounded-lg shadow-xl bg-white"
                                src={image.pngUrl}
                            />
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default GetUserNFTsWithMetadata;