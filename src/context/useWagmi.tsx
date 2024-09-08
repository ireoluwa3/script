import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  mainnet,
  arbitrum,
  polygon,
  bsc,
  fantom,
  avalanche,
} from "wagmi/chains";
import { cookieStorage, createStorage } from "wagmi";
import { walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const chains = [mainnet, arbitrum, polygon, bsc, fantom, avalanche];

let config;

if (projectId) {
  config = createConfig({
    connectors: [walletConnect({ projectId })],
    chains: chains as any,
    transports: chains.reduce((acc, chain) => {
      acc[chain.id] = http();
      return acc;
    }, {}),
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
  });
} else {
  console.warn("Project ID is not defined. Skipping wallet connect setup.");
  config = null;
}

const queryClient = new QueryClient();

export const WagmiProviderWrapper = ({ children }: { children: ReactNode }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </WagmiProvider>
);

export default WagmiProviderWrapper;
