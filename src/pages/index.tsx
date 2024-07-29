import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Arrow from '~/components/Arrow'
import ColorMinter from '~/components/ColorMinter'
import Nav from '~/components/Nav'
import OwnedColors from '~/components/OwnedColors'

const Home: NextPage = () => {
  const [color, setColor] = useState<string | null>(null)
  const [gradientColor1, setGradientColor1] = useState<string | null>(null)
  const [gradientColor2, setGradientColor2] = useState<string | null>(null)
  const [isGradientMode, setIsGradientMode] = useState(false)
  const [isColorMinterOpen, setIsColorMinterOpen] = useState(false)
  const { address } = useAccount();

  useEffect(() => {
    if (!address) {
      setColor(null)
      setGradientColor1(null)
      setGradientColor2(null)
      setIsGradientMode(false)
    }
  }, [address])

  const handleColorSelect = (selectedColor: string, isGradient: boolean) => {
    setIsGradientMode(isGradient);
    if (isGradient) {
      if (!gradientColor1) {
        setGradientColor1(selectedColor);
      } else if (!gradientColor2) {
        setGradientColor2(selectedColor);
      } else {
        setGradientColor1(selectedColor);
        setGradientColor2(null);
      }
    } else {
      setColor(selectedColor);
      setGradientColor1(null);
      setGradientColor2(null);
    }
  }

  const handleColorMinterClose = () => {
    setIsColorMinterOpen(false)
    // Reset color selection when ColorMinter is closed
    setColor(null)
    setGradientColor1(null)
    setGradientColor2(null)
    setIsGradientMode(false)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Higher Colors</title>
        <meta name="description" content="Mint your favorite color as an NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className="flex-grow flex flex-col lg:flex-row justify-center items-center bg-black px-4 relative">
        <div className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
          <Arrow
            color={color || '#000000'}
            gradientColor1={isGradientMode ? gradientColor1 : null}
            gradientColor2={isGradientMode ? gradientColor2 : null}
          />
          {!address && (
            <p className='text-white text-xs mt-4 text-center'>Connect Wallet to Change Color and Mint</p>
          )}
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