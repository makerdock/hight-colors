import classNames from 'classnames'
import { AnimatePresence, motion } from "framer-motion"
import type { NextPage } from 'next'
import Head from 'next/head'
import Arrow from '~/components/Arrow'
import SuccessSidebar, { extractValuesFromAttributes } from '~/components/SuccessSidebar'
import { Network, Alchemy, Nft } from 'alchemy-sdk';
import { GetServerSideProps } from 'next';
import { env } from '~/env'
import ArrowDetailsSidebar from '~/components/ArrowDetailsSidebar'
import { getArrowColors } from '~/utils/getArrowColors'

const Home: NextPage<{ token?: Nft, farcasterAccount?: any, ownerAddress?: any }> = ({ token, farcasterAccount, ownerAddress }) => {

  console.log("🚀 ~ token:", ownerAddress)
  if (!token) {
    return <div></div>
  }
  const { primaryColor, invertMode, isBGMode } = extractValuesFromAttributes(token.raw.metadata?.attributes)

  const { arrowColor, backgroundColor } = getArrowColors({
    primaryColor,
    bgMode: true,
    invertMode: false
  });

  console.log("🚀 ~ arrowColor, backgroundColor:", arrowColor, backgroundColor)

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Head>
        <title>Higher Colors</title>
        <meta name="description" content="Mint your higher arrow with Base Colors" />
        <link rel="icon" href="/arrow.svg" />
        <meta property="og:image" content={`https://highercolors.com/api/${arrowColor}/${backgroundColor}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content={`https://highercolors.com/api/${arrowColor}/${backgroundColor}`} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`https://highercolors.com/api/${arrowColor}/${backgroundColor}`} />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        <meta property="fc:frame:button:1" content="Check this out" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content={`https://highercolors.com/arrow/${token.tokenId}`} />
        <meta property="fc:frame:button:2" content="Mint" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content="https://highercolors.com/" />
      </Head>
      <main className="flex-grow flex flex-col lg:flex-row justify-center items-center px-0 relative w-full max-w-4xl mx-auto flex-1 min-h-[100dvh] md:min-h-full">

        <div
          className={classNames('md:flex flex-1 md:flex-auto items-stretch border border-slate-200 overflow-hidden shadow-lg w-full bg-white relative',
          )}
        >
          <motion.div
            // onClick={() => setSidebarMode(sidebarMode === 'mint' ? 'success' : 'mint')}
            style={{
              backgroundColor: isBGMode ? primaryColor : invertMode ? 'black' : 'white',
            }}
            animate className="w-full h-full flex place-content-center aspect-square max-h-52 md:max-h-[70vh] sticky top-0 pt-12 md:pt-0">
            {<Arrow
              primaryColor={primaryColor}
              invertMode={invertMode}
              secondaryColor={primaryColor}
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
            className="lg:mt-0 border-l-1 bg-white border-black/20 md:min-w-[300px] border-l border-slate-200 md:h-auto h-auto overflow-y-scroll overflow-x-hidden relative flex-1"
          >
            <AnimatePresence
              initial={false}
            >
              <motion.div
                key="success"
                initial={{ opacity: '0%' }}
                animate={{ opacity: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.5 }}
                className='w-full h-full max-h-[70vh] overflow-hidden'
              >
                <ArrowDetailsSidebar token={token} ownerAddress={ownerAddress} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  )
}



export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tokenId } = context.params as { tokenId: string };

  // Configure Alchemy SDK
  const settings = {
    apiKey: env.ALCHEMY_API_KEY,
    network: Network.BASE_MAINNET, // or your preferred network
  };
  const alchemy = new Alchemy(settings);

  try {
    // Fetch NFT metadata
    const response = await alchemy.nft.getNftMetadata(
      env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as string,
      tokenId
    );


    // Get the current owner's address
    const ownerResponse = await alchemy.nft.getOwnersForNft(env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as string, tokenId);
    const ownerAddress = ownerResponse.owners[0];

    // let farcasterAccount;
    // if (ownerAddress) {
    //   // Fetch Farcaster account information
    //   const farcasterResponse = await fetch(
    //     `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${ownerAddress}&address_types=verified_address`,
    //     {
    //       headers: {
    //         'accept': 'application/json',
    //         'api_key': env.NEYNAR_API_KEY as string,
    //       },
    //     }
    //   );

    //   const farcasterData = await farcasterResponse.json();
    //   farcasterAccount = farcasterData[ownerAddress.toLowerCase()]?.[0];
    // }

    // Fetch Farcaster account information
    // const farcasterResponse = await fetch(
    //   `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${response}&address_types=verified_address`,
    //   {
    //     headers: {
    //       'accept': 'application/json',
    //       'api_key': process.env.NEYNAR_API_KEY as string,
    //     },
    //   }
    // );

    // const farcasterData = await farcasterResponse.json();
    // const farcasterAccount = farcasterData[ownerAddress.toLowerCase()]?.[0];


    // Return the data as props
    return {
      props: {
        token: JSON.parse(JSON.stringify(response)),
        // farcasterAccount,
        ownerAddress
      },
    };
  } catch (error) {
    console.error('Error fetching NFT data:', error);
    return {
      props: {
        data: {},
      },
    };
  }
};

export default Home