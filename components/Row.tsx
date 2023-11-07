import styles from "@/styles/Home.module.css";
// import DialogDemo from "./PrintDialog";
import LogDialog from "./LogDialog";
import Link from "next/link";
import { DownloadIcon } from "@radix-ui/react-icons";
import { PrintIcon } from "./PrintIcon";
import { StatusTypes } from "@/utils/enums";

export interface RowProps {
  data: {
    mac?: string;
    status?: string;
    date?: Date | string;
  };
}

export function Row({ data }: RowProps) {
  const { mac, status, date } = data;

  const date_label = date ? new Date(date) : undefined;

  return (
    <div className={styles.row}>
      <span></span>
      <span>{mac}</span>
      <span>{date_label && formatDate(date_label)}</span>
      <span className={styles.status_label}>{status}</span>
      <div className={styles.row_action}>
        <LogDialog testeId={mac!} />
        {data.status && data.status !== StatusTypes.FAIL && (
          <Link href={`/api/print?id=${mac}`} type="button">
            <PrintIcon />
          </Link>
        )}
      </div>
    </div>
  );
}
