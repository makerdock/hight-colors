import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from '~/env'
import { AlchemyResponse } from '~/utils/alchemyResponse'

const apiKey = env.ALCHEMY_API_KEY
// const contractAddress = env.NEXT_PUBLIC_BASECOLOR_CONTRACT_ADDRESS

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { ownerAddress, contractAddress, chain = "mainnet", limit = '100' } = req.query

    if (!ownerAddress || typeof ownerAddress !== 'string') {
        return res.status(400).json({ error: 'Owner address is required' })
    }

    const options = { method: 'GET', headers: { accept: 'application/json' } };
    const url = `https://base-${chain.toString()}.g.alchemy.com/nft/v3/${apiKey.toString()}/getNFTsForOwner?owner=${ownerAddress.toString()}&contractAddresses[]=${contractAddress?.toString()}&withMetadata=true&pageSize=${limit.toString()}`;

    try {
        const response = await fetch(url, options);
        const data: AlchemyResponse = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching owned NFTs:', error);
        res.status(500).json({ error: 'Failed to fetch NFTs' });
    }
}
