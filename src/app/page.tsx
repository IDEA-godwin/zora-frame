"use client";

import Demo from "~/components/Demo";

// import dynamic from "next/dynamic";

// const Demo = dynamic(() => import("~/components/Demo"), {
//   ssr: false,
// });

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <Demo />
    </main>
  );
}
