"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

const Demo = dynamic(() => import("~/components/Demo"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: "Frames v2 Demo" }
) {

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_URL)
  })
  return <Demo title={title} />;
}