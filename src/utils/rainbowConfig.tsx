import { ReactNode } from 'react';

import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { http, createConfig } from '@wagmi/core'
import { base } from '@wagmi/core/chains'


export const wagmiConfig = getDefaultConfig({
    appName: 'YOUR_APP_NAME',
    projectId: 'YOUR_PROJECT_ID',
    chains: [base],
    ssr: true, // If your dApp uses server side rendering (SSR)
    transports: {
        [base.id]: http(),
    },
});

export const wagmiCoreConfig = createConfig({
    chains: [base],
    transports: {
        [base.id]: http(),
    },
})


const queryClient = new QueryClient();

export const RainbowWalletProvider: React.FC<{ children?: ReactNode }> = ({ children }) => <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
            {children}
        </RainbowKitProvider>
    </QueryClientProvider>
</WagmiProvider>