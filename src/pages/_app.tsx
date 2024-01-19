import "@/styles/globals.css";
import { defaultTheme } from "@/styles/theme";
import type { AppProps } from "next/app";

import { Inter } from "next/font/google";
import { ThemeProvider } from "styled-components";
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <main className={inter.className} style={inter.style}>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}
