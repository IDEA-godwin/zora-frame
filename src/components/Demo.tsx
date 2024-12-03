import { useEffect, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";

import { wagmiConfig as config } from "~/utils/config";

import { Button } from "~/components/ui/Button";
import CreateTokenForm from "./ui/CreateTokenForm";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Demo(
  { title }: { title?: string } = { title: "Zora Launcher" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<FrameContext>()

  const { isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
    if(sdk && isSDKLoaded) {
      if(!isConnected){
        connect({ connector: config.connectors[0] })
      }
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Launch Zora</h1>
        <div>
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
      </div>
      <CreateTokenForm />
    </div>
  );
}


{/* <div>
<h2 className="font-2xl font-bold">Actions</h2>

<div className="mb-4">
  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
    <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
      sdk.actions.openUrl
    </pre>
  </div>
  <Button onClick={openUrl}>Open Link</Button>
</div>

<div className="mb-4">
  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
    <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
      sdk.actions.close
    </pre>
  </div>
  <Button onClick={close}>Close Frame</Button>
</div>
</div> */}