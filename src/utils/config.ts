"server only"

import { createConfig, http } from "wagmi";
import { base, zora } from "viem/chains";
import { frameConnector } from "~/lib/connector";
import { PinataSDK } from "pinata-web3"
import { walletConnect } from "wagmi/connectors";
import { createClient } from "viem";

export const wagmiConfig = createConfig({
  chains: [zora, base],
  connectors: [
    frameConnector(),
    // walletConnect({ projectId: process.env.WALLET_CONNECT_ID! })
  ],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
});

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.GATEWAY_URL}`
})