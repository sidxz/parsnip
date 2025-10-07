import { Geist, Geist_Mono } from "next/font/google";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/viva-light/theme.css";
import "primeflex/themes/primeone-light.css";
import "./globals.css";
import GlobalNavbar from "./components/ui/GlobalNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Daikon Target Tool",
  description: "Daikon",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <PrimeReactProvider>
          <div className="flex flex-column w-full">
            <div className="flex w-full">
              <GlobalNavbar />
            </div>
            <div className="flex w-full">{children}</div>
          </div>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
