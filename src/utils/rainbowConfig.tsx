import { ReactNode } from 'react';

import {
    getDefaultConfig,
    RainbowKitProvider
} from '@rainbow-me/rainbowkit';

import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
// import { http, createConfig } from '@wagmi/core'
// import { base } from '@wagmi/chains'

// import { base } from 'wagmi/chains'
import { base } from '@wagmi/core/chains';
import { env } from '~/env';

const projectId = env.NEXT_PUBLIC_WALLET_CONNECT_KEY;
console.log("🚀 ~ projectId:", projectId)


// const { wallets } = getDefaultWallets({
//     appName: 'HigherArrows',
//     projectId,
//     chains: [base],
// });

// export const wagmiConfig = getDefaultConfig({
//     appName: 'HigherArrows',
//     projectId,
//     chains: [base],
//     ssr: true, // If your dApp uses server side rendering (SSR)
//     transports: {
//         [base.id]: http(),
//     },
// });

// export const wagmiCoreConfig = createConfig({
//     chains: [base],
//     connectors: [
//         walletConnect({
//             projectId,
//         }),
//     ],
//     transports: {
//         [base.id]: http(),
//     },
// })

export const wagmiCoreConfig = getDefaultConfig({
    appName: "HigherColors",
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    projectId,
    chains: [base],
    ssr: true,
});



const queryClient = new QueryClient();

export const RainbowWalletProvider: React.FC<{ children?: ReactNode }> = ({ children }) => <WagmiProvider config={wagmiCoreConfig}>
    <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={base}>
            {children}
        </RainbowKitProvider>
    </QueryClientProvider>
</WagmiProvider>