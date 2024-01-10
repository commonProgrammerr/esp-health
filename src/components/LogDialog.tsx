import React, { useCallback, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "@/styles/dialog.module.css";
import { Cross2Icon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Inter } from "next/font/google";

import { useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

const inter = Inter({ subsets: ["latin"] });

interface LogDialogProps {
  testeId: string;
}

export default function LogDialog({ testeId }: LogDialogProps) {
  const [logs, setLogs] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<Socket | null>(null);
  const handleOpenDialog = useCallback(
    () => setIsOpen((op) => !op),
    [setIsOpen]
  );

  useEffect(() => {
    console.log(isOpen, ref.current);
    if (isOpen) {
      if (ref.current) return;

      fetch(`/api/log/${testeId}`);
      ref.current = io();

      ref.current.on("connect", () => console.log("connected"));
      ref.current.on("client-new", (id) => console.log("client-id:", id));
      ref.current.on("line", (msg) => setLogs((logs) => logs + msg));
    } else {
      if (ref.current) {
        ref.current.disconnect();
        ref.current.close();
        ref.current = null;
      }
      setLogs(() => {
        return "";
      });
    }
  }, [isOpen, testeId]);

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Trigger asChild>
        <button onClick={handleOpenDialog}>
          <EyeOpenIcon />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          onClick={handleOpenDialog}
          className={styles.DialogOverlay}
        />
        <Dialog.Content className={styles.DialogContent}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Dialog.Title className={styles.DialogTitle}>
              Dispositivo {testeId}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                onClick={handleOpenDialog}
                className={styles.IconButton}
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description
            className={styles.DialogLogView}
            style={inter.style}
            asChild
          >
            <code>
              {logs.split("\n").map((line, i) => (
                <code key={`${line}@${i}`}>{line}</code>
              ))}
            </code>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
