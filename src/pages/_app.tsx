// import { GeistSans } from "geist/font/sans";
import "@rainbow-me/rainbowkit/styles.css";
import { type AppType } from "next/app";
import '../styles/fonts.css';

import "~/styles/globals.css";
import "~/styles/gradient.css";
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowWalletProvider } from "~/utils/rainbowConfig";
import { Toaster } from "~/components/ui/toaster";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <RainbowWalletProvider>
      <div>
        <Component {...pageProps} />
        <Toaster />
      </div>
    </RainbowWalletProvider>
  );
};

export default MyApp;
