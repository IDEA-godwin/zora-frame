"server only"

import { createConfig, http } from "wagmi";
import { base, zora } from "viem/chains";
import { frameConnector } from "~/lib/connector";
import { PinataSDK } from "pinata-web3"

export const wagmiConfig = createConfig({
  chains: [base, zora],
  transports: {
    [base.id]: http(),
    [zora.id]: http()
  },
  connectors: [frameConnector()],
});

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`
})