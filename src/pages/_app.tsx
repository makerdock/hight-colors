import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import '../styles/fonts.css'

import "~/styles/globals.css";
import { RainbowWalletProvider } from "~/utils/rainbowConfig";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <RainbowWalletProvider>
      <div className={GeistSans.className}>
        <Component {...pageProps} />
      </div>
    </RainbowWalletProvider>
  );
};

export default MyApp;
