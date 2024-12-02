import { useCallback, useState } from "react";
import {
   useAccount,
   useSendTransaction,
   useSignMessage,
   useSignTypedData,
   useWaitForTransactionReceipt,
   useDisconnect,
   useConnect,
} from "wagmi";


import { wagmiConfig as config } from "~/utils/config";
import { truncateAddress } from "~/lib/truncateAddress";
import { Button } from "./Button"

export default function Wallet() {

   const [txHash, setTxHash] = useState<string | null>(null);

   const { address, isConnected } = useAccount();
   const {
     sendTransaction,
     error: sendTxError,
     isError: isSendTxError,
     isPending: isSendTxPending,
   } = useSendTransaction();

   const { isLoading: isConfirming, isSuccess: isConfirmed } =
     useWaitForTransactionReceipt({
       hash: txHash as `0x${string}`,
     });

   const {
     signMessage,
     error: signError,
     isError: isSignError,
     isPending: isSignPending,
   } = useSignMessage();

   const {
     signTypedData,
     error: signTypedError,
     isError: isSignTypedError,
     isPending: isSignTypedPending,
   } = useSignTypedData();

   const { disconnect } = useDisconnect();
   const { connect } = useConnect();

   const sendTx = useCallback(() => {
      sendTransaction(
      {
         to: "0x4bBFD120d9f352A0BEd7a014bd67913a2007a878",
         data: "0x9846cd9efc000023c0",
      },
      {
         onSuccess: (hash) => {
            setTxHash(hash);
         },
      }
      );
   }, [sendTransaction]);

   const sign = useCallback(() => {
      signMessage({ message: "Hello from Frames v2!" });
   }, [signMessage]);

   const signTyped = useCallback(() => {
      signTypedData({
      domain: {
         name: "Frames v2 Demo",
         version: "1",
         chainId: 8453,
      },
      types: {
         Message: [{ name: "content", type: "string" }],
      },
      message: {
         content: "Hello from Frames v2!",
      },
      primaryType: "Message",
      });
   }, [signTypedData]);


   const renderError = (error: Error | null) => {
      if (!error) return null;
      return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
   };

   return (
      <div>
      <h2 className="font-2xl font-bold">Wallet</h2>

      {address && (
        <div className="my-2 text-xs">
          Address: <pre className="inline">{truncateAddress(address)}</pre>
        </div>
      )}

      <div className="mb-4">
        <Button
          onClick={() =>
            isConnected
              ? disconnect()
              : connect({ connector: config.connectors[0] })
          }
        >
          {isConnected ? "Disconnect" : "Connect"}
        </Button>
      </div>

      {isConnected && (
        <>
          <div className="mb-4">
            <Button
              onClick={sendTx}
              disabled={!isConnected || isSendTxPending}
              isLoading={isSendTxPending}
            >
              Send Transaction
            </Button>
            {isSendTxError && renderError(sendTxError)}
            {txHash && (
              <div className="mt-2 text-xs">
                <div>Hash: {truncateAddress(txHash)}</div>
                <div>
                  Status:{" "}
                  {isConfirming
                    ? "Confirming..."
                    : isConfirmed
                    ? "Confirmed!"
                    : "Pending"}
                </div>
              </div>
            )}
          </div>
          <div className="mb-4">
            <Button
              onClick={sign}
              disabled={!isConnected || isSignPending}
              isLoading={isSignPending}
            >
              Sign Message
            </Button>
            {isSignError && renderError(signError)}
          </div>
          <div className="mb-4">
            <Button
              onClick={signTyped}
              disabled={!isConnected || isSignTypedPending}
              isLoading={isSignTypedPending}
            >
              Sign Typed Data
            </Button>
            {isSignTypedError && renderError(signTypedError)}
          </div>
        </>
      )}
    </div>
   )
}