

import { createCreatorClient } from "@zoralabs/protocol-sdk"
import { usePublicClient, useChainId } from "wagmi"
import { pinata } from "~/utils/config"

export const postToContract = (title: string, imageUrl: string) => {
  const publicClient = usePublicClient() as any
  const chainId = useChainId()
  const zoraClient = createCreatorClient({chainId, publicClient})
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