import React, { useCallback, useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "@/styles/dialog.module.css";
import { Cross2Icon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Inter } from "next/font/google";

import { useState } from "react";
import io, { Socket } from "socket.io-client";
// import { useSocketIo } from "@/hooks/useSocketIo";
import { useAsyncFn } from "react-use";
import { api } from "@/services/api";

const inter = Inter({ subsets: ["latin"] });

interface LogDialogProps {
  testeId: string;
}

export default function LogDialog({ testeId }: LogDialogProps) {
  const [logs, setLogs] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [{ loading, value }, load] = useAsyncFn(async () =>
    api.get(`/log/${testeId}`)
  );

  const ref = useRef<Socket | null>(null);
  useEffect(() => {
    if (isOpen) {
      if (ref.current) return;

      ref.current = io(`ws://${window.location.hostname}:8080/`, {
        autoConnect: true,
      })
        .emit("sub", testeId)
        .on("line", (msg) => {
          console.log(msg);
          setLogs((logs) => logs + msg);
        });
    }

    return () => {
      ref.current?.disconnect();
      ref.current?.close();
      ref.current = null;
      setLogs("");
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      load();
    }
  }, [isOpen, load]);

  const handleOpenDialog = useCallback(
    () =>
      setIsOpen((op) => {
        if (op) ref.current.disconnect();
        return !op;
      }),
    [setIsOpen]
  );

  // function socketHanlde(io: Socket) {
  //   io.on("line", (msg) => setLogs((logs) => logs + msg));

  //   return () => {
  //     if (!isOpen) {
  //       io.disconnect();
  //       io.close();
  //       socket_ref.current = null;
  //       setLogs("");
  //     }
  //   };
  // }

  // const socket_ref = useSocketIo(`/api/socket/${testeId}`, socketHanlde);

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
              {loading
                ? "carregando..."
                : value?.data
                    .split("\n")
                    .map((line, i) => (
                      <code key={`_${line}@${i}`}>{line}</code>
                    ))}
              {logs.length > 0
                ? logs
                    .split("\n")
                    .map((line, i) => <code key={`${line}@${i}`}>{line}</code>)
                : !Boolean(value?.data) && "(vazio)"}
            </code>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
