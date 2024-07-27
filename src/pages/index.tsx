// File: pages/index.tsx
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { ethers } from 'ethers'
import { ChromePicker, ColorChangeHandler } from 'react-color'
import { ColorArrowNFTABI } from '~/utils/ColorArrowNFTABI'
import { OwnedNft } from '~/utils/alchemyResponse'
import { higherArrowNftAbi } from '~/utils/abi'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    }
  }
}

interface ColorNFT {
  color: string;
}

const UpArrowIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="60" height="60" viewBox="0 0 60 " fill={color}>
    <path d="M12 4l-8 8h6v8h4v-8h6z" />
  </svg>
);

export default function Home() {
  const [color, setColor] = useState<string>('#ffffff')
  const [account, setAccount] = useState<string | null | undefined>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [ownedColors, setOwnedColors] = useState<ColorNFT[]>([])
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [isMinting, setIsMinting] = useState<boolean>(false);
  // const [mintedColor, setMintedColor] = useState<string | null>(null);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  const mintContract = '0xe3375a05F4102932B8470079d279E2b6DB14cA4d'

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        setAccount(address)

        fetchOwnedColors(address)
      } catch (error) {
        console.error(error)
      }
    } else {
      console.log('Please install MetaMask!')
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setContract(null)
    setOwnedColors([])
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0 && accounts[0]) {
      setAccount(accounts[0])
      fetchOwnedColors(accounts[0])
    } else {
      disconnectWallet()
    }
  }

  const fetchOwnedColors = async (ownerAddress: string) => {
    try {
      const response = await fetch(`/api/getColors?ownerAddress=${ownerAddress}`);
      if (!response.ok) {
        throw new Error('Failed to fetch NFTs');
      }
      const colors = await response.json();
      setOwnedColors(colors);
    } catch (error) {
      console.error('Error fetching owned NFTs:', error);
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [])

  const handleColorChange: ColorChangeHandler = (color) => {
    setColor(color.hex)
  }

  const handleColorBoxClick = (color: string) => {
    setSelectedColor(color);
  }

  const mintNFT = async (): Promise<void> => {
    if (typeof window.ethereum === 'undefined') {
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contractAddress = '0xe3375a05F4102932B8470079d279E2b6DB14cA4d' // Replace with your deployed contract address
    const mintContract = new ethers.Contract(contractAddress, higherArrowNftAbi, signer)

    setIsMinting(true);
    try {
      // const colorWithoutHash = color.slice(1); // Remove the '#' from the color string
      const transaction = await mintContract.mint(color);
      await transaction.wait();
      console.log('NFT minted successfully!');
      // setMintedColor(color);
    } catch (error) {
      console.error('Failed to mint NFT:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Head>
        <title>Color NFT Minter</title>
        <meta name="description" content="Mint your favorite color as an NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-4xl font-bold mb-8">Color NFT Minter</h1>
        {account ? (
          <>
            <p className="mb-4">Connected Account: {account}</p>
            <ChromePicker color={color} onChange={handleColorChange} className="mb-4" />
            <button
              onClick={mintNFT}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
            >
              Mint NFT
            </button>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-4">Your Color NFTs</h2>
              <div className="grid grid-cols-3 gap-4">
                {ownedColors.map((color, index) => (
                  <div
                    key={index}
                    className="w-full aspect-square rounded"
                    style={{ backgroundColor: color.color }}
                    title={color.color}
                    onClick={() => handleColorBoxClick(color.color)}
                  ></div>
                ))}
              </div>
              <div className="ml-4">
                <UpArrowIcon color={selectedColor || 'black'} />
              </div>
            </div>
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Disconnect Wallet
            </button>
          </>
        ) : (
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Connect Wallet
          </button>
        )}
      </main>
    </div>
  )
}