import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import styles from "@/styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

export default function Home() {
  const [logs, setLogs] = useState("");
  const ref = useRef<Socket | null>(null);

  const socketInitializer = async () => {
    if (ref.current) return;
    fetch("/api/log/teste");
    ref.current = io();

    ref.current.on("connect", () => console.log("connected"));
    ref.current.on("client-new", (id) => console.log("client-id:", id));
    ref.current.on("line", (msg) => setLogs((logs) => logs + msg));
  };

  useEffect(() => {
    socketInitializer();
  }, []);

  return (
    <main className={`${styles.main} ${inter.className}`}>
      {logs.split("\n").map((line) => (
        <span key={line}>{line}</span>
      ))}
    </main>
  );
}
