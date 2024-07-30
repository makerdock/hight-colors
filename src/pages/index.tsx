import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Arrow from '~/components/Arrow'
import GradientCanvas from '~/components/Gradient'
import Nav from '~/components/Nav'
import OwnedColors from '~/components/OwnedColors'
import useColorStore from '~/stores/useColorStore'

const Home: NextPage = () => {
  const { isBGMode, setIsBGMode, primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor,
    isGradientMode, setIsGradientMode, invertMode, setInvertMode } = useColorStore()
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

  const handleColorSelect = (selectedColor: string, isGradient: boolean, selectedBgMode: boolean, selectedInvertMode: boolean) => {
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
    setInvertMode(selectedInvertMode)
  }

  const handleColorMinterClose = () => {
    setIsColorMinterOpen(false)
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
        {!!address && <div className='bg-white md:flex items-stretch rounded-lg overflow-hidden shadow-lg w-full'>
          <div className="w-full h-full flex place-content-center aspect-square">
            {!!address && <Arrow
              primaryColor={primaryColor || '#fff'}
              invertMode={invertMode}
              secondaryColor={secondaryColor}
              bgMode={isBGMode}
            />}
            {/* {!address && (
            <p className='text-white text-xs mt-4 text-center'>Connect Wallet to Change Color and Mint</p>
          )} */}
          </div>
          {address && (
            <div className="lg:mt-0 border-l-1 border-black/20 md:min-w-[300px] border-l border-gray-200 md:h-auto h-[30vh] overflow-y-scroll">
              <OwnedColors onColorSelect={handleColorSelect} />
            </div>
          )}
        </div>}
      </main>
      {/* <footer className="text-center text-xs py-4 text-white">
        <p>Made with Love by Gayatri</p>
      </footer> */}
    </div>
  )
}

export default Home