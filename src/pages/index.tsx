import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Arrow from '~/components/Arrow'
import ColorMinter from '~/components/ColorMinter'
import GradientCanvas from '~/components/Gradient'
import Gradient from '~/components/Gradient'
import Nav from '~/components/Nav'
import OwnedColors from '~/components/OwnedColors'
import useColorStore from '~/stores/useColorStore'
import { hasGoodContrast } from '~/utils/hasGoodContrast'
import { hasGoodGradientContrast } from '~/utils/hasGoodGradientContrast'

const Home: NextPage = () => {
  const { isBGMode, setIsBGMode, primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor, isGradientMode, setIsGradientMode } = useColorStore()
  console.log("🚀 ~ isBGMode:", isBGMode)

  const [isColorMinterOpen, setIsColorMinterOpen] = useState(false)

  const { address } = useAccount();

  useEffect(() => {
    if (!address) {
      setPrimaryColor(undefined)
      setPrimaryColor(undefined)
      setSecondaryColor(undefined)
      setIsGradientMode(false)
    }
  }, [address])

  const handleColorSelect = (selectedColor: string, isGradient: boolean, selectedBgMode: boolean) => {
    console.log("🚀 ~ handleColorSelect ~ selectedBgMode:", selectedBgMode)
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
  }

  const handleColorMinterClose = () => {
    setIsColorMinterOpen(false)
    // Reset color selection when ColorMinter is closed
    setPrimaryColor(undefined)
    setSecondaryColor(undefined)
    setIsGradientMode(false)
  }


  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Higher Colors</title>
        <meta name="description" content="Mint your favorite color as an NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!!address && <Nav />}
      <main className="flex-grow flex flex-col lg:flex-row justify-center items-center bg-black px-4 relative">
        <div className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
          {!!address && <Arrow
            primaryColor={primaryColor || '#fff'}
            invertMode={
              (isGradientMode && primaryColor && secondaryColor) ?
                !!hasGoodGradientContrast(primaryColor, secondaryColor) :
                !hasGoodContrast(primaryColor || '#fff')}
            secondaryColor={secondaryColor}
            bgMode={isBGMode}
          />}
          {!address && <GradientCanvas colors={['#a960ee', '#ff333d', '#90e0ff', '#ffcb57']} />}
          {!address && <Nav />}
          {/* {!address && (
            <p className='text-white text-xs mt-4 text-center'>Connect Wallet to Change Color and Mint</p>
          )} */}
        </div>
        {address && (
          <div className="mt-8 lg:mt-0 lg:ml-8 w-full max-w-xs md:max-w-sm lg:w-80">
            <OwnedColors onColorSelect={handleColorSelect} />
          </div>
        )}
      </main>
      <footer className="text-center text-xs py-4 text-white">
        <p>Made with Love by Gayatri</p>
      </footer>
      <ColorMinter
        isOpen={isColorMinterOpen}
        onClose={handleColorMinterClose}
        colorCheckerContract={null} // Replace with actual contract if needed
      />
    </div>
  )
}

export default Home