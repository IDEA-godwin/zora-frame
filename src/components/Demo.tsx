import { useEffect, useCallback, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";

import { Button } from "~/components/ui/Button";
import Wallet from "./ui/Wallet";
import CreateTokenButton from "./ui/CreateTokenButton";
import CreateTokenForm from "./ui/CreateTokenForm";

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [isContextOpen, setIsContextOpen] = useState(false);

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

  const toggleContext = useCallback(() => {
    setIsContextOpen((prev) => !prev);
  }, []);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2 relative">
      <h1 className="text-2xl font-bold text-center mb-4">Launch Zora</h1>
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