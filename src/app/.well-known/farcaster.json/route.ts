export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjMyNzQxNCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweGMyNTkzZTc3NDVCMTBDOTVGMDdENkRDMDAxNTM3OTE2NmUxZThCMmIifQ",
      payload: "eyJkb21haW4iOiJ6b3JhLWZyYW1lLnZlcmNlbC5hcHAifQ",
      signature: "MHhjNmVmYTI0Y2ExNjk3NGI2MmJkYmVjOTdlOGRmNGQ0YWYxMTdhYzJlNGU3M2YzMThhZjU4NGFlYmYzNDM0YWFiMTIyNThlZjk4OThmZWI5Yjk3YWQ4ZGU2MDQxYzBlY2I1N2VmYWQyYzBkYTMyYzcyOWJhNGZiMDY3YTk3YmQwMDFi",
    },
    frame: {
      version: "0.0.0",
      name: "Zora Launcher",
      icon: `${appUrl}/Zorb.png`,
      splashImage: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      homeUrl: appUrl
    },
  };

  return Response.json(config);
}
