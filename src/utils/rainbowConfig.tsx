import { ReactNode } from 'react';

import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    base,
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
    appName: 'YOUR_APP_NAME',
    projectId: 'YOUR_PROJECT_ID',
    chains: [base],
    ssr: true, // If your dApp uses server side rendering (SSR)
});


const queryClient = new QueryClient();

export const RainbowWalletProvider: React.FC<{ children?: ReactNode }> = ({ children }) => <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
            {children}
        </RainbowKitProvider>
    </QueryClientProvider>
</WagmiProvider>