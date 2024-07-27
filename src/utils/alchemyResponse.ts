export interface AlchemyResponse {
    ownedNfts: OwnedNft[]
    totalCount: number
    validAt: ValidAt
    pageKey: any
}

export interface OwnedNft {
    contract: Contract
    tokenId: string
    tokenType: string
    name: string
    description: string
    tokenUri: any
    image: Image
    raw: Raw
    collection: any
    mint: Mint
    owners: any
    timeLastUpdated: string
    balance: string
    acquiredAt: AcquiredAt
}

export interface Contract {
    address: string
    name: string
    symbol: string
    totalSupply: string
    tokenType: string
    contractDeployer: string
    deployedBlockNumber: number
    openSeaMetadata: OpenSeaMetadata
    isSpam: any
    spamClassifications: any[]
}

export interface OpenSeaMetadata {
    floorPrice: any
    collectionName: any
    collectionSlug: any
    safelistRequestStatus: any
    imageUrl: any
    description: any
    externalUrl: any
    twitterUsername: any
    discordUrl: any
    bannerImageUrl: any
    lastIngestedAt: any
}

export interface Image {
    cachedUrl: string
    thumbnailUrl: string
    pngUrl: string
    contentType: string
    size: number
    originalUrl: string
}

export interface Raw {
    tokenUri: string
    metadata: Metadata
    error: any
}

export interface Metadata {
    name: string
    description: string
    image: string
    attributes: Attribute[]
}

export interface Attribute {
    value: string
    trait_type: string
}

export interface Mint {
    mintAddress: any
    blockNumber: any
    timestamp: any
    transactionHash: any
}

export interface AcquiredAt {
    blockTimestamp: any
    blockNumber: any
}

export interface ValidAt {
    blockNumber: number
    blockHash: string
    blockTimestamp: string
}
