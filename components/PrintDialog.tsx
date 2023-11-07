import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "@/styles/dialog.module.css";
import { Cross2Icon, Share1Icon, DownloadIcon } from "@radix-ui/react-icons";
import { useFetch } from "@/hooks/useFetch";
interface DialogProps {
  id: string;
  enabled?: boolean;
}

export default function DialogDemo({ id, enabled }: DialogProps) {
  const { data } = useFetch(`/api/print/image?id=${id}`);
  console.log(data);
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button disabled={!enabled}>
          <Share1Icon />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.DialogOverlay} />
        <Dialog.Content className={styles.DialogContent}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Dialog.Title className={styles.DialogTitle}>
              Print code
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className={styles.IconButton} aria-label="Close">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </div>
          {/* <Dialog.Description className={styles.DialogDescription}>
          Make changes to your profile here. Click save when you re done.
        </Dialog.Description> */}
          {/* <img src={`data:image/png;base64,${data}`} alt="" /> */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
