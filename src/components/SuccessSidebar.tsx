import React from 'react'
import BlurIn from './magicui/blur-in'
import { Button } from './ui/button'
import FarcasterIcon from './icons/FarcasterIcon'
import { FaXTwitter } from 'react-icons/fa6'
import { MdCopyAll, MdOutlineFileDownload } from 'react-icons/md'
import useColorStore from '~/stores/useColorStore'

const SuccessSidebar = () => {
    const { primaryColor, isBGMode, invertMode } = useColorStore()
    const secondaryColor = invertMode ? 'black' : 'white'
    return (
        <div
            className='relative w-full h-full flex items-start flex-col justify-center px-6'
        >

            <BlurIn
                word="You have minted Arrow #23"
                className="text-xl md:text-3xl font-bold text-black dark:text-white text-left text-balance"
            />
            <div className="flex items-stretch my-4 flex-col space-y-2 w-full">

                <div className='rounded-md w-full border border-gray-200 text-xs flex items-stretch h-7'>
                    <div className='p-1 px-2 flex-1 bg-gray-100 uppercase tracking-wider font-bold'>Primary Color</div>
                    <div className='p-1 px-2 flex items-center justify-start space-x-1 w-24'>
                        <span style={{ background: primaryColor }} className='aspect-square rounded-sm h-3 w-3' />
                        <span className=' text-sm'>{primaryColor}</span>
                    </div>
                </div>

                <div className='rounded-md w-full border border-gray-200 text-xs flex items-stretch h-7'>
                    <div className='p-1 px-2 flex-1 bg-gray-100 uppercase tracking-wider font-bold'>Back Color</div>
                    <div className='p-1 px-2 flex items-center justify-start space-x-1  w-24'>
                        <span style={{ background: secondaryColor }} className='aspect-square rounded-sm h-3 w-3' />
                        <span className=' text-sm'>{secondaryColor}</span>
                    </div>
                </div>

                <div className='rounded-md w-full border border-gray-200 text-xs flex items-stretch h-7'>
                    <div className='p-1 px-2 flex-1 bg-gray-100 uppercase tracking-wider font-bold'>Inverted</div>
                    <div className='p-1 px-2 italic  w-24'>{String(isBGMode)}</div>
                </div>

            </div>
            <h3 className="text-sm uppercase tracking-widest font-bold text-gray-500 mb-2">Share your high</h3>
            <div className="flex space-x-2 items-center">
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
            </div>
        </div>
    )
}

export default SuccessSidebar