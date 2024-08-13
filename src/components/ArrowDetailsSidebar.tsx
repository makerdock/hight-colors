import { Nft } from 'alchemy-sdk'
import { motion } from 'framer-motion'
import BlurIn, { defaultVariantsForBlurIn } from './magicui/blur-in'
import ShineBorder from './magicui/shine-border'
import ShareOptions from './ShareOptions'
import { extractValuesFromAttributes } from './SuccessSidebar'
import Link from 'next/link'
import { formatEthAddress } from '~/utils/formatEthAddress'


const listItem = {
    hidden: { filter: "blur(10px)", opacity: 0 },
    show: { filter: "blur(0px)", opacity: 1 },
};

const ArrowDetailsSidebar = (props: { token: Nft, ownerAddress: string }) => {
    const { token } = props;
    const { primaryColor, isBGMode, invertMode } = extractValuesFromAttributes(token.raw.metadata?.attributes || []);
    const name = token?.name

    const secondaryColor = invertMode ? '#000000' : '#ffffff'

    return (
        <div
            className='relative w-full h-full flex items-start flex-col justify-center p-8'
        >
            <BlurIn

                className="text-xl md:text-3xl font-bold text-black dark:text-white text-left text-balance"
            >
                {name}
            </BlurIn>
            <div
                className="font-display text-md font-medium drop-shadow-sm md:text-md md:leading-[2rem]"
            >
                by {formatEthAddress(props.ownerAddress)}
            </div>
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
                    <div className='p-1 px-2 flex-1 bg-gray-100 text-gray-500 uppercase tracking-wider font-bold'>First Color</div>
                    <div className='p-1 px-2 flex items-center justify-start space-x-1 w-24'>
                        <span style={{ background: primaryColor }} className='aspect-square rounded-sm h-4 w-4 border border-gray-400' />
                        <span className='uppercase text-sm'>{primaryColor}</span>
                    </div>
                </motion.div>
                <motion.div variants={listItem} className='rounded-md w-full border border-gray-200 text-xs flex items-stretch h-7'>
                    <div className='p-1 px-2 flex-1 bg-gray-100 text-gray-500 uppercase tracking-wider font-bold'>Second Color</div>
                    <div className='p-1 px-2 flex items-center justify-start space-x-1  w-24'>
                        <span style={{ background: secondaryColor }} className='aspect-square rounded-sm h-4 w-4 border border-gray-400 ' />
                        <span className='uppercase text-sm'>{secondaryColor}</span>
                    </div>
                </motion.div>
                <motion.div variants={listItem} className='rounded-md w-full border border-gray-200 text-xs flex items-stretch h-7'>
                    <div className='p-1 px-2 flex-1 bg-gray-100 text-gray-500 uppercase tracking-wider font-bold'>Inverted</div>
                    <div className='p-1 px-2 uppercase text-sm w-24'>{String(isBGMode)}</div>
                </motion.div>
            </motion.div>
            <Link className='w-full' href="/">
                <ShineBorder
                    className="text-center mt-10 text-sm font-bold uppercase w-full tracking-widest shadow-lg cursor-pointer"
                    color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                    borderWidth={2}
                >
                    <span>MINT YOUR OWN</span>
                </ShineBorder>
            </Link>
        </div >
    )
}


export default ArrowDetailsSidebar