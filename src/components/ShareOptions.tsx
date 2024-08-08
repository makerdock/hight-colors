import React from 'react'
import { extractValuesFromAttributes, listItem } from './SuccessSidebar'
import { motion } from "framer-motion"
import { Button } from './ui/button'
import FarcasterIcon from './icons/FarcasterIcon'
import { FaXTwitter } from 'react-icons/fa6'
import { MdCopyAll, MdOutlineFileDownload } from 'react-icons/md'
import { toast } from './ui/use-toast'
import useColorStore from '~/stores/useColorStore'

const ShareOptions = () => {
    const { mintedNftMetadata } = useColorStore()

    const tokenId = mintedNftMetadata?.name.split('Color Arrow #')[1]

    const shareMessage = `I just minted ${name} on Higher! Check it out!`
    const shareUrl = `https://higher.xyz/nft/${tokenId}` // Replace with actual URL

    const handleFarcasterShare = () => {
        // Implement Farcaster sharing logic here
        // This might involve opening a new window or redirecting to Farcaster with pre-filled content
        console.log('Sharing to Farcaster:', shareMessage, shareUrl)
        toast({
            title: 'Sharing to Farcaster',
            description: 'Opening Farcaster to share your NFT...',
        })
    }

    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`
        window.open(twitterUrl, '_blank')
    }

    const handleCopyShare = async () => {
        const textToCopy = `${shareMessage} ${shareUrl}`
        try {
            await navigator.clipboard.writeText(textToCopy)
            toast({
                title: 'Copied to clipboard',
                description: 'Share link has been copied to your clipboard.',
            })
        } catch (err) {
            console.error('Failed to copy text: ', err)
            toast({
                title: 'Copy failed',
                description: 'Unable to copy to clipboard. Please try again.',
                variant: 'destructive',
            })
        }
    }

    const handleDownload = () => {
        // Assuming mintedNftMetadata.image is a base64 encoded image
        const link = document.createElement('a')
        link.href = mintedNftMetadata?.image || ''
        link.download = `${name}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast({
            title: 'Download started',
            description: 'Your NFT image is being downloaded.',
        })
    }
    return (
        <motion.div variants={listItem} className="flex space-x-2 items-center">
            <Button size="icon" variant={"outline"} onClick={handleFarcasterShare}>
                <FarcasterIcon className="h-6 w-6" />
            </Button>
            <Button size="icon" variant={"outline"} onClick={handleTwitterShare}>
                <FaXTwitter className="h-6 w-6" />
            </Button>
            <Button size="icon" variant={"outline"} onClick={handleCopyShare}>
                <MdCopyAll className="h-6 w-6" />
            </Button>
            <Button size="icon" variant={"outline"} onClick={handleDownload}>
                <MdOutlineFileDownload className="h-6 w-6" />
            </Button>
        </motion.div>
    )
}

export default ShareOptions