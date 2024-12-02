import type { Metadata } from "next";

import "~/app/globals.css";
import { Providers } from "~/app/providers";

export const metadata: Metadata = {
  title: "Farcaster Frames v2 Demo",
  description: "A Farcaster Frames v2 demo app",
};

type FrameEmbed = {
  version: 'next';
  imageUrl: string;
  button: {
    title: string;
    action: {
      type: 'launch_frame';
      name: string;
      url: string;
      splashImageUrl: string;
      splashBackgroundColor: string;
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appUrl = process.env.NEXT_PUBLIC_URL as string
  const embed: FrameEmbed = {
    version: "next",
    imageUrl: `${appUrl}/Zorb.png`,
    button: {
      title: "Zora Launcher",
      action: {
        type: 'launch_frame',
        name: 'Zora Launcher',
        url: appUrl,
        splashImageUrl: '',
        splashBackgroundColor: '#fff'
      }
    }
  }

  return (
    <html lang="en">
      <head>
        <meta name="fc:frame" content={JSON.stringify(embed)} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
