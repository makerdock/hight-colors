import { motion } from "framer-motion"
import { FaXTwitter } from 'react-icons/fa6'
import { MdCopyAll, MdOutlineFileDownload } from 'react-icons/md'
import FarcasterIcon from './icons/FarcasterIcon'
import { listItem } from './SuccessSidebar'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'

const ShareOptions = (props: { name: string, image: string }) => {
    const tokenId = props.name.split('Higher Arrow #')[1]

    const shareMessage = `I just minted ${props?.name || ''} on Higher! Check it out:`
    const shareUrl = `https://highercolors.com/a/${tokenId}` // Replace with actual URL

    const handleFarcasterShare = () => {
        const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareMessage)}&embeds[]=${encodeURIComponent(shareUrl)}`;
        window.open(warpcastUrl, '_blank');
        console.log('Sharing to Farcaster:', shareMessage, shareUrl);
        // toast({
        //     title: 'Sharing to Farcaster',
        //     description: 'Opening Farcaster to share your NFT...',
        // })
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
        link.href = props?.image || ''
        link.download = `${props?.name || ''}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast({
            title: 'Download started',
            description: 'Your NFT image is being downloaded.',
        })
    }

    const openSeaUrl = `https://opensea.io/assets/base/0xf00a42891f5a156ab6b866184d49ea032b6f792c/${tokenId}`;

    return (
        <motion.div variants={listItem} className="flex space-x-2 items-center">
            <Button size="icon" variant={"outline"} onClick={handleFarcasterShare}>
                <FarcasterIcon className="h-6 w-6" />
            </Button>
            <Button size="icon" variant={"outline"} onClick={handleTwitterShare}>
                <FaXTwitter className="h-6 w-6" />
            </Button>
            <Button size="icon" variant={"outline"}>
                <a
                    href={openSeaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img className="w-6 h-auto object-contain" src="/Logomark.svg" alt="OpenSea logo" />
                </a>
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