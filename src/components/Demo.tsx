import { useEffect, useCallback, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useSignTypedData,
  useWaitForTransactionReceipt,
  useDisconnect,
  useConnect,
} from "wagmi";

import { config } from "~/components/providers/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // const { address, isConnected } = useAccount();
  // const {
  //   sendTransaction,
  //   error: sendTxError,
  //   isError: isSendTxError,
  //   isPending: isSendTxPending,
  // } = useSendTransaction();

  // const { isLoading: isConfirming, isSuccess: isConfirmed } =
  //   useWaitForTransactionReceipt({
  //     hash: txHash as `0x${string}`,
  //   });

  // const {
  //   signMessage,
  //   error: signError,
  //   isError: isSignError,
  //   isPending: isSignPending,
  // } = useSignMessage();

  // const {
  //   signTypedData,
  //   error: signTypedError,
  //   isError: isSignTypedError,
  //   isPending: isSignTypedPending,
  // } = useSignTypedData();

  // const { disconnect } = useDisconnect();
  // const { connect } = useConnect();

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  const openUrl = useCallback(() => {
    sdk.actions.openUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  }, []);

  const close = useCallback(() => {
    sdk.actions.close();
  }, []);

  // const sendTx = useCallback(() => {
  //   sendTransaction(
  //     {
  //       to: "0x4bBFD120d9f352A0BEd7a014bd67913a2007a878",
  //       data: "0x9846cd9efc000023c0",
  //     },
  //     {
  //       onSuccess: (hash) => {
  //         setTxHash(hash);
  //       },
  //     }
  //   );
  // }, [sendTransaction]);

  // const sign = useCallback(() => {
  //   signMessage({ message: "Hello from Frames v2!" });
  // }, [signMessage]);

  // const signTyped = useCallback(() => {
  //   signTypedData({
  //     domain: {
  //       name: "Frames v2 Demo",
  //       version: "1",
  //       chainId: 8453,
  //     },
  //     types: {
  //       Message: [{ name: "content", type: "string" }],
  //     },
  //     message: {
  //       content: "Hello from Frames v2!",
  //     },
  //     primaryType: "Message",
  //   });
  // }, [signTypedData]);

  const toggleContext = useCallback(() => {
    setIsContextOpen((prev) => !prev);
  }, []);

  const renderError = (error: Error | null) => {
    if (!error) return null;
    return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
  };

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">Frames v2 Demo</h1>
    </div>
  );
}
