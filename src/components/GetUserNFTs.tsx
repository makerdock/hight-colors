import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount, } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { env } from '~/env';

const abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)"
];

interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    tokenId: number;
}

const GetUserNFTsWithMetadata = () => {
    const { address, isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const [nfts, setNfts] = useState<NFTMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNFTData = async () => {
            if (!isConnected) return;

            setIsLoading(true);
            setError(null);

            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                const contract = new ethers.Contract(env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS, abi, signer);

                const balance = await contract.balanceOf(address);
                console.log("🚀 ~ fetchNFTData ~ balance:", balance)
                const tokenIds = [];

                for (let i = 0; i < balance.toNumber(); i++) {
                    const tokenId = await contract.tokenOfOwnerByIndex(address, i);
                    tokenIds.push(tokenId.toNumber());
                }

                const metadataPromises = tokenIds.map(async (tokenId) => {
                    const uri = await contract.tokenURI(tokenId);
                    const response = await fetch(uri);
                    const metadata = await response.json();
                    return { tokenId, metadata };
                });

                const nftsWithMetadata = await Promise.all(metadataPromises);
                console.log("🚀 ~ fetchNFTData ~ nftsWithMetadata:", nftsWithMetadata)
                // setNfts(nftsWithMetadata);
            } catch (err) {
                setError('Error fetching NFT data: ' + err.message);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNFTData();
    }, [address, isConnected]);

    if (!isConnected) {
        return (
            <div>
                <p>Please connect your wallet to view your NFTs.</p>
                <button onClick={openConnectModal}>Connect Wallet</button>
            </div>
        );
    }

    if (isLoading) return <div>Loading NFT data...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <ul>
                {nfts?.map(({ tokenId, metadata }) => (
                    <li key={tokenId}>
                        <h3>Token ID: {tokenId}</h3>
                        <p>Name: {metadata.name}</p>
                        <p>Description: {metadata.description}</p>
                        {metadata.image && <img src={metadata.image} alt={metadata.name} style={{ maxWidth: '200px' }} />}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GetUserNFTsWithMetadata;