import classNames from 'classnames'
import { AnimatePresence, motion } from "framer-motion"
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import Arrow from '~/components/Arrow'
import GetUserNFTs from '~/components/GetUserNFTs'
import GradientCanvas from '~/components/Gradient'
import LoadingSidebar from '~/components/LoadingSidebar'
import Nav from '~/components/Nav'
import OwnedColors from '~/components/OwnedColors'
import SuccessSidebar from '~/components/SuccessSidebar'
import useColorStore from '~/stores/useColorStore'

const Home: NextPage = () => {
  const { isBGMode, setIsBGMode, primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor,
    isGradientMode, setIsGradientMode, invertMode, setInvertMode,
    sidebarMode, setSidebarMode
  } = useColorStore()
  console.log("🚀 ~ sidebarMode:", sidebarMode)
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
          className={classNames(' md:flex items-stretch rounded-2xl border border-slate-200 overflow-hidden shadow-lg w-full bg-white',
          )}
        >
          <motion.div
            // onClick={() => setSidebarMode(sidebarMode === 'mint' ? 'success' : 'mint')}
            style={{
              backgroundColor: isBGMode ? primaryColor : invertMode ? 'black' : 'white',
            }}
            animate className="w-full h-full flex place-content-center aspect-square max-h-[80vh] relative">
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
            initial={{ x: '100%' }}
            animate={{ x: "0%", }}
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.5 }}
            exit={{ x: '100%' }}
            className="lg:mt-0 border-l-1 bg-white border-black/20 md:min-w-[300px] border-l border-slate-200 md:h-auto h-[30vh] overflow-y-scroll overflow-x-hidden relative"
          >
            <AnimatePresence
              initial={false}
            >
              {sidebarMode === "mint" &&
                <motion.div
                  key="mint"
                  initial={{ opacity: '0%' }}
                  animate={{ opacity: "100%" }}
                  className='w-full h-full max-h-[80vh] overflow-hidden'
                >
                  <OwnedColors onColorSelect={handleColorSelect} />
                </motion.div>
              }
              {sidebarMode === "loading" &&
                <motion.div
                  key="loading"
                  initial={{ opacity: '0%', }}
                  animate={{ opacity: "100%", }}
                  className='w-full h-full max-h-[80vh] overflow-hidden'
                >
                  <LoadingSidebar />
                </motion.div>
              }

              {sidebarMode === "success" &&
                <motion.div
                  key="success"
                  initial={{ opacity: '0%' }}
                  animate={{ opacity: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.5 }}
                  className='w-full h-full max-h-[80vh] overflow-hidden'
                >
                  <SuccessSidebar />
                </motion.div>
              }
            </AnimatePresence>
          </motion.div>
        </div>}
        <GetUserNFTs />
      </main>
    </div>
  )
}

export default Home