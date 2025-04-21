import "../globals.css";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
        <div className="min-h-[calc(100vh-500px)]">
        {children}
        </div>
  );
}
