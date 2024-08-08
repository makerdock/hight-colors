import React from 'react'
import BlurIn from './magicui/blur-in'
import { Button } from './ui/button'
import FarcasterIcon from './icons/FarcasterIcon'
import { FaXTwitter } from 'react-icons/fa6'
import { MdCopyAll, MdOutlineFileDownload } from 'react-icons/md'
import useColorStore from '~/stores/useColorStore'
import { motion } from 'framer-motion'
import ShineBorder from './magicui/shine-border'

// const container = ;

const listItem = {
    hidden: { filter: "blur(10px)", opacity: 0 },
    show: { filter: "blur(0px)", opacity: 1 },
};

const SuccessSidebar = () => {
    const { primaryColor, isBGMode, invertMode } = useColorStore()
    const secondaryColor = invertMode ? 'black' : 'white'

    const handleRefresh = () => {
        window.location.reload();
    }

    return (
        <div
            className='relative w-full h-full flex items-start flex-col justify-center p-8'
        >
            <BlurIn
                className="text-xl md:text-3xl font-bold text-black dark:text-white text-left text-balance"
            >
                You have minted Arrow #23
            </BlurIn>
            <motion.div
                className='space-y-2 flex-1 mt-6'
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.5,
                            delayChildren: 1
                        }
                    }
                }} initial="hidden" animate="show"
            >

                <motion.div variants={listItem} className='rounded-md w-full border border-gray-200 text-xs flex items-stretch h-7'>
                    <div className='p-1 px-2 flex-1 bg-gray-100 text-gray-500 uppercase tracking-wider font-bold'>Primary Color</div>
                    <div className='p-1 px-2 flex items-center justify-start space-x-1 w-24'>
                        <span style={{ background: primaryColor }} className='aspect-square rounded-sm h-4 w-4 border border-gray-400' />
                        <span className='uppercase text-sm'>{primaryColor}</span>
                    </div>
                </motion.div>
                <motion.div variants={listItem} className='rounded-md w-full border border-gray-200 text-xs flex items-stretch h-7'>
                    <div className='p-1 px-2 flex-1 bg-gray-100 text-gray-500 uppercase tracking-wider font-bold'>Back Color</div>
                    <div className='p-1 px-2 flex items-center justify-start space-x-1  w-24'>
                        <span style={{ background: secondaryColor }} className='aspect-square rounded-sm h-4 w-4 border border-gray-400 ' />
                        <span className='uppercase text-sm'>{secondaryColor}</span>
                    </div>
                </motion.div>
                <motion.div variants={listItem} className='rounded-md w-full border border-gray-200 text-xs flex items-stretch h-7'>
                    <div className='p-1 px-2 flex-1 bg-gray-100 text-gray-5</motion.div>00 uppercase tracking-wider font-bold'>Inverted</div>
                    <div className='p-1 px-2 uppercase text-sm w-24'>{String(isBGMode)}</div>
                </motion.div>
                <motion.h3 variants={listItem} className="!mt-8 text-sm uppercase tracking-widest font-bold text-gray-500">Share your high</motion.h3>
                <motion.div variants={listItem} className="flex space-x-2 items-center">
                    <Button size="icon" variant={"outline"}>
                        <FarcasterIcon className="h-6 w-6" />
                    </Button>
                    <Button size="icon" variant={"outline"}>
                        <FaXTwitter className="h-6 w-6" />
                    </Button>
                    <Button size="icon" variant={"outline"}>
                        <MdCopyAll className="h-6 w-6" />
                    </Button>
                    <Button size="icon" variant={"outline"}>
                        <MdOutlineFileDownload className="h-6 w-6" />
                    </Button>
                </motion.div>

            </motion.div>
            <ShineBorder
                className="text-center mt-10 text-sm font-bold uppercase w-full tracking-widest shadow-lg cursor-pointer"
                color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                borderWidth={2}
            >
                <button onClick={handleRefresh}>MINT AGAIN</button>
            </ShineBorder>
        </div>
    )
}

export default SuccessSidebar