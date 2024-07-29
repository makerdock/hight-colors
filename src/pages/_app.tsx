// import { GeistSans } from "geist/font/sans";
import "@rainbow-me/rainbowkit/styles.css";
import { type AppType } from "next/app";
import '../styles/fonts.css';

import "~/styles/globals.css";
import "~/styles/gradient.css";
import { RainbowWalletProvider } from "~/utils/rainbowConfig";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <RainbowWalletProvider>
      <div>
        {/* <Script src="http://localhost:3001/gradient.js" /> */}
        <Component {...pageProps} />
      </div>
    </RainbowWalletProvider>
  );
};

export default MyApp;
