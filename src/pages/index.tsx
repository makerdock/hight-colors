import { ChevronRightIcon } from '@heroicons/react/16/solid'
import classNames from 'classnames'
import { AnimatePresence, motion } from "framer-motion"
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import Arrow from '~/components/Arrow'
import GradientCanvas from '~/components/Gradient'
import FarcasterIcon from '~/components/icons/FarcasterIcon'
import BlurIn from '~/components/magicui/blur-in'
import Particles from '~/components/magicui/particles'
import Nav from '~/components/Nav'
import OwnedColors from '~/components/OwnedColors'
import { Button } from '~/components/ui/button'
import useColorStore from '~/stores/useColorStore'
import { FaXTwitter } from "react-icons/fa6";
import { MdCopyAll } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";

const Home: NextPage = () => {
  const { isBGMode, setIsBGMode, primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor,
    isGradientMode, setIsGradientMode, invertMode, setInvertMode,
    sidebarMode, setSidebarMode
  } = useColorStore()
  // const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  // const [isColorMinterOpen, setIsColorMinterOpen] = useState(false)

  const { address } = useAccount();

  useEffect(() => {
    if (!address) {
      setPrimaryColor(undefined)
      setPrimaryColor(undefined)
      setSecondaryColor(undefined)
      setIsGradientMode(false)
    } else {
      // setSidebarMode("mint")
    }
  }, [address])

  const handleColorSelect = (selectedColor: string, isGradient: boolean, selectedBgMode: boolean, selectedInvertMode: boolean) => {
    setIsGradientMode(isGradient);

    if (isGradient) {

      if (!primaryColor) {
        setPrimaryColor(selectedColor);
      } else if (!secondaryColor) {
        setSecondaryColor(selectedColor);
      } else {
        setPrimaryColor(selectedColor);
        setSecondaryColor(undefined);
      }

    } else {
      setPrimaryColor(selectedColor);
      setSecondaryColor(selectedColor);
    }

    setIsBGMode(selectedBgMode)
    setInvertMode(selectedInvertMode)
  }

  const handleColorMinterClose = () => {
    // setIsColorMinterOpen(false)
    // Reset color selection when ColorMinter is closed
    setPrimaryColor(undefined)
    setSecondaryColor(undefined)
    setIsGradientMode(false)
  }


  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Head>
        <title>Higher Colors</title>
        <meta name="description" content="Mint your favorite color as an NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!!address && <Nav />}
      <main className="flex-grow flex flex-col lg:flex-row justify-center items-center px-4 relative w-full max-w-4xl mx-auto flex-1">
        <div>
          {!address && <GradientCanvas colors={['#a960ee', '#ff333d', '#90e0ff', '#ffcb57']} />}
          {!address && <Nav />}
        </div>
        {!!address && <div
          className={classNames(' md:flex items-stretch rounded-2xl border border-slate-200 overflow-hidden shadow-lg w-full',
            invertMode ? 'bg-black' : 'bg-white',
          )}
        >
          <motion.div animate className="w-full h-full flex place-content-center aspect-square max-h-[60vh]">
            {!!address && <Arrow

              primaryColor={primaryColor}
              invertMode={invertMode}
              secondaryColor={secondaryColor}
              bgMode={isBGMode}
            />}
            {/* {!address && (
            <p className='text-white text-xs mt-4 text-center'>Connect Wallet to Change Color and Mint</p>
          )} */}
          </motion.div>

          <motion.div
            key="modal"
            initial={{ x: '100%' }}
            animate={{ x: "0%" }}
            exit={{ x: '100%' }}
            className="lg:mt-0 border-l-1 bg-white border-black/20 md:min-w-[300px] border-l border-slate-200 md:h-auto h-[30vh] overflow-y-scroll overflow-x-hidden"
          >
            <AnimatePresence
              initial={false}
            >
              {sidebarMode === "mint" &&
                <motion.div
                  key="mint"
                  initial={{ opacity: '0%' }}
                  animate={{ opacity: "100%" }}
                  exit={{ opacity: '0%' }}
                >
                  <OwnedColors onColorSelect={handleColorSelect} />
                </motion.div>
              }
              {sidebarMode === "loading" &&
                <motion.div
                  key="loading"
                  initial={{ opacity: '0%' }}
                  animate={{ opacity: "100%" }}
                  exit={{ opacity: '0%' }}
                  className='relative w-full h-full flex items-center justify-center px-6'
                >
                  {/* <h3 className='text-3xl'>Loading...</h3> */}
                  <BlurIn
                    word="Minting your arrow"
                    className="text-xl font-bold text-black dark:text-white text-center"
                  />
                  <Particles
                    className="absolute inset-0"
                    quantity={100}
                    ease={80}
                    color={"#000"}
                    refresh
                  />
                </motion.div>
              }

              {sidebarMode === "success" &&
                <motion.div
                  key="success"
                  initial={{ opacity: '0%' }}
                  animate={{ opacity: "100%" }}
                  exit={{ opacity: '0%' }}
                  className='relative w-full h-full flex items-start flex-col justify-center px-6'
                >
                  <BlurIn
                    word="You have minted Arrow #23"
                    className="text-xl md:text-3xl font-bold text-black dark:text-white text-left text-balance"
                  />
                  <div className="flex items-stretch my-4 flex-col space-y-2 w-full">

                    <div className='rounded-md w-full border border-gray-200 text-xs flex items-stretch h-7'>
                      <div className='p-1 px-2 flex-1 bg-gray-100 uppercase tracking-wider font-bold'>Color</div>
                      <div className='p-1 px-2 flex-1 flex items-center justify-start space-x-1'>
                        <span style={{ background: '#242424' }} className='aspect-square rounded-sm h-3 w-3' />
                        <span className=' text-sm'>#242423</span>
                      </div>
                    </div>

                    <div className='rounded-md w-full border border-gray-200 text-xs flex items-stretch h-7'>
                      <div className='p-1 px-2 flex-1 bg-gray-100 uppercase tracking-wider font-bold'>Inverted</div>
                      <div className='p-1 px-2 flex-1 italic'>true</div>
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
                </motion.div>
              }
            </AnimatePresence>
          </motion.div>
        </div>}
      </main>
    </div>
  )
}

export default Home