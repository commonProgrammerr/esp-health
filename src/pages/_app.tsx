import "@/styles/globals.css";
import { defaultTheme } from "@/styles/theme";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { Inter } from "next/font/google";
import { ThemeProvider } from "styled-components";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <>
        <main className={inter.className} style={inter.style}>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Component {...pageProps} />
        </main>
      </>
    </ThemeProvider>
  );
}
