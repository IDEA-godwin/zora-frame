

import { ContractMetadataJson, createCreatorClient, makeMediaTokenMetadata } from "@zoralabs/protocol-sdk"
import { publicActions } from "viem"
import { useWalletClient, useClient } from "wagmi"
import { pinata, wagmiConfig as config } from "~/utils/config"

export const buildPostRequest = async ({contractAddress, tokenMetadaURI, chainId}: any) => {

  const publicClient = useClient()?.extend(publicActions) as any
  const zoraClient = createCreatorClient({ chainId, publicClient })

  const { data } = useWalletClient()

  try {
    const { parameters } = await zoraClient.create1155OnExistingContract({
      contractAddress,
      token: {
        tokenMetadataURI: tokenMetadaURI
      },
      account: data?.account as any
    })
    const { request } = await publicClient.simulateContract(parameters);
    return request
  } catch (e) {
    throw e
  }

}

export async function makeImageTokenMetadata(imageFile: File, title: string) {
  // upload image and thumbnail to Pinata
  const { IpfsHash } = await pinata.upload.file(imageFile)

  // build token metadata json from the text and thumbnail file
  // ipfs urls
  const metadataJson = makeMediaTokenMetadata({
    mediaUrl: `ipfs://${IpfsHash}`,
    name: title,
  });
  // upload token metadata json to Pinata and get ipfs uri
  const pinResponse = await pinata.upload.json(metadataJson);

  return `ipfs://${pinResponse.IpfsHash}`;
}

export async function makeContractMetadata(imageFile: File, name: string, description: string) {
  const { IpfsHash } = await pinata.upload.file(imageFile)
  const metadataJson: ContractMetadataJson = {
    description,
    image: `ipfs://${IpfsHash}`,
    name
  }
  const { IpfsHash: hash } = await pinata.upload.json(metadataJson)
  return `ipfs://${hash}`
}

export const uploadToIPFS = async (img: File): Promise<{err: boolean, message: string, url?: string}> => {
  try {
    const uploadData = await pinata.upload.file(img)
    const url = await pinata.gateways.convert(uploadData.IpfsHash)
    return {err: false, message: 'upload successful', url}
  } catch(e: any) {
    console.log(e)
    return {
      err: true,
      message: `upload failed${e.message ? ' with message: ' + e.message : ''}`
    }
  }
}