import { SubmitHandler, useForm } from "react-hook-form"
import { Button } from "./Button"
import { useEffect, useState } from "react"
import { buildPostRequest, makeImageTokenMetadata } from "~/services"
import { BaseError, useChainId, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from "wagmi"

type Inputs = {
  collection: string
  title: string
  tokenImage: FileList
}


export default function CreateTokenForm() {

  const chainId = useChainId()
  const { chains, switchChain } = useSwitchChain()
  const { data: hash, isPending, writeContract } = useWriteContract()

  const [uploadedFile, setUploadedFile] = useState('')
  const [chainsOptionVisible, setChainsOptionVisible] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [alert, setAlert] = useState<{type: 'Success'|'Danger', message: string, class: string}>()

   const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash
    })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  useEffect(() => {
    const image: any = watch('tokenImage')[0]
    if(!image) return
    const url = URL.createObjectURL(image)

    console.log(url)
    setUploadedFile(url)
  }, [watch('tokenImage')])

  useEffect(() => {
    if(isConfirmed) {
      setAlert({
        type: 'Success',
        class: ' bg-green-50  text-green-800 dark:text-green-400',
        message: 'post made successfully with transaction hash ' + hash
      })
    }
  }, [isConfirmed])

  useEffect(() => {
    setTimeout(() => setAlert(undefined), 6000)
  }, [alert])

  const createToken: SubmitHandler<Inputs> = async (data) =>{
    setLoading(true)
    try {
      const tokenMetadataURI = await makeImageTokenMetadata(data.tokenImage[0], data.title);
      const request = await buildPostRequest({contractAddress: data.collection, tokenMetadataURI})
      writeContract(request)
      setLoading(false)
    }catch (e) {
      let error = e as BaseError
      setLoading(false)
      setAlert({
        type: 'Danger',
        class: ' bg-red-50  text-red-800 dark:text-red-400',
        message: error.shortMessage || error.message
      })
    }

  }

  const renderError = (error: {err: any, msg: string}) => {
    if (!error.err) return null;
    return <div className="text-red-500 text-xs mt-1">{error.msg}</div>;
  }

  return(
    <form className="" onSubmit={handleSubmit(createToken)}>
      {alert && <div className={`p-4 mb-4 text-sm rounded-lg dark:bg-gray-800 ${alert.class}`} role="alert">
        <span className="font-medium">{alert.type} alert!</span> {alert.message}
      </div>}
      <div className="space-y-5">
        <div className="col-span-full">
          <label className="block text-sm/6 font-medium text-gray-900">Collection Address</label>
          <div className="mt-2">
            <div className="flex items-center flex-row-reverse rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
              <div
                id="menu-button" aria-expanded="true" aria-haspopup="true"
                onClick={() => setChainsOptionVisible(!chainsOptionVisible)}
                className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6 pe-2"
              >
                { chainId && chains.filter(c => c.id === chainId)[0].name }
                { !chainId && "zora"}
              </div>
              <input
                type="text" id="collection" placeholder="0x" {...register("collection", { required: true })}
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              />
            </div>
            { renderError({err: errors.collection, msg: 'specify the collection contract to create token on'}) }
            <div className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none ${chainsOptionVisible ? 'block' : 'hidden'}`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
              <div className="py-1" role="none">
                {/* <!-- Active: "bg-gray-100 text-gray-900 outline-none", Not Active: "text-gray-700" --> */}
                { chains.map(c => <a
                  onClick={() => {switchChain({ chainId: c.id }); setChainsOptionVisible(false)}}
                  role="menuitem" tabIndex={-1} id={`menu-item-${c.id}`} key={c.id}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >{ c.name }</a>)}
              </div>
            </div>

          </div>
        </div>

        <div className="col-span-full">
          <label className="block text-sm/6 font-medium text-gray-900">Title</label>
          <div className="mt-2">
            <input
              type="text" id="title" {...register("title", { required: true })}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            { renderError({err: errors.title, msg: 'input title for token'}) }
          </div>
        </div>


        <div className="col-span-full">
          <label className="relative flex justify-between text-sm/6 font-medium text-gray-900">
            Token Image
            {
              uploadedFile &&
              <span className="absolute -bottom-2 right-0 z-10 inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={12} height={12} >
                  <path d="M373.5 27.1C388.5 9.9 410.2 0 433 0c43.6 0 79 35.4 79 79c0 22.8-9.9 44.6-27.1 59.6L277.7 319l-10.3-10.3-64-64L193 234.3 373.5 27.1zM170.3 256.9l10.4 10.4 64 64 10.4 10.4-19.2 83.4c-3.9 17.1-16.9 30.7-33.8 35.4L24.3 510.3l95.4-95.4c2.6 .7 5.4 1.1 8.3 1.1c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32c0 2.9 .4 5.6 1.1 8.3L1.7 487.6 51.5 310c4.7-16.9 18.3-29.9 35.4-33.8l83.4-19.2z"/>
                </svg>
              </span>
            }
          </label>
          {!uploadedFile && <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
              </svg>
              <div className="mt-4 flex text-sm/6 text-gray-600">
                <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                  <span>Upload a file</span>
                  <input id="file-upload" type="file" className="sr-only" {...register("tokenImage", { required: true })} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>}
          {uploadedFile && <div className="flex justify-center px-3 py-1">
            <div className="relative">
              <img src={uploadedFile} alt="token_image" />
            </div>
          </div>}

          { renderError({err: errors.tokenImage, msg: 'upload token image'}) }
        </div>

        <div className="col-span-full">
          <Button isLoading={loading || isPending || isConfirming} onClick={handleSubmit(createToken)}>Post</Button>
        </div>
      </div>
    </form>
  )
}