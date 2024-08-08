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
        <meta name="description" content="Mint your higher arrow with Base Colors" />
        <link rel="icon" href="/arrow.svg" />
        <meta property="og:image" content="https://highercolors.com/og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta property="og:url" content="https://highercolors.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Higher Colors" />
        <meta property="og:description" content="Mint your higher arrow with Base Colors" />
        <meta property="og:image" content="https://highercolors.com/og.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="highercolors.com" />
        <meta property="twitter:url" content="https://highercolors.com/" />
        <meta name="twitter:title" content="Higher Colors" />
        <meta name="twitter:description" content="Mint your higher arrow with Base Colors" />
        <meta name="twitter:image" content="https://highercolors.com/og.png" />

      </Head>
      {!!address && <Nav />}
      <main className="flex-grow flex flex-col lg:flex-row justify-center items-center px-0 relative w-full max-w-4xl mx-auto flex-1 min-h-[100dvh] md:min-h-full">
        <div>
          {!address && <GradientCanvas colors={['#a960ee', '#ff333d', '#90e0ff', '#ffcb57']} />}
          {!address &&
            <Nav />
          }
        </div>
        {!!address && <div
          className={classNames('flex flex-col md:flex-row flex-1 md:flex-auto items-stretch border border-slate-200 overflow-hidden shadow-lg w-full bg-white relative',
          )}
        >
          <motion.div
            style={{
              backgroundColor: isBGMode ? primaryColor : invertMode ? 'black' : 'white',
            }}
            animate className="w-full h-full flex place-content-center aspect-square max-h-[50dvh] md:max-h-[80dvh] sticky top-0 md:pt-0">
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
            className="lg:mt-0 md:border-l-1 flex md:block border-t-2 md:border-t-0 border-black/20 md:min-w-[300px] border-l border-slate-200 md:h-full h-full overflow-y-scroll overflow-x-hidden relative flex-1"
          >
            <AnimatePresence
              initial={false}
            >
              {sidebarMode === "mint" &&
                <motion.div
                  key="mint"
                  initial={{ opacity: '0%' }}
                  animate={{ opacity: "100%" }}
                  className='w-full h-full md:max-h-max max-h-[80dvh] overflow-hidden'
                >
                  <OwnedColors onColorSelect={handleColorSelect} />
                </motion.div>
              }
              {sidebarMode === "loading" &&
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='w-full h-full flex-1 overflow-hidden min-h-[50dvh]'
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
                  className='w-full h-full max-h-[80dvh] overflow-hidden'
                >
                  <SuccessSidebar />
                </motion.div>
              }
            </AnimatePresence>
          </motion.div>
        </div>}
        {!!address && <GetUserNFTs />
        }
      </main>
    </div>
  )
}

export default Home