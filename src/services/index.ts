

import { createCreatorClient, makeMediaTokenMetadata } from "@zoralabs/protocol-sdk"
import { usePublicClient, useChainId, useWalletClient, useWriteContract } from "wagmi"
import { pinata } from "~/utils/config"

export const buildPostRequest = async ({contractAddress, tokenMetadaURI}: any) => {
  const publicClient = usePublicClient() as any
  const chainId = useChainId()
  const zoraClient = createCreatorClient({chainId, publicClient})

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
  const { IpfsHash } = await pinata.upload.file(imageFile);;

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