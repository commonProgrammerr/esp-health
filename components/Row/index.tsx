import LogDialog from "../LogDialog";
import Link from "next/link";
import styles from "./styles.module.css";

import { PrintIcon } from "../PrintIcon";
import { StatusTypes } from "@/utils/enums";
import { formatDate } from "@/utils/formatDate";

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
    <div className={styles.container}>
      <span></span>
      <span>{mac}</span>
      <span>{date_label && formatDate(date_label)}</span>
      <span>{status}</span>
      <div className={styles.row_action}>
        {data.status && data.status !== StatusTypes.FAIL && (
          <Link href={`/api/print?id=${mac}`} type="button">
            <PrintIcon />
          </Link>
        )}
        <LogDialog testeId={mac!} />
      </div>
    </div>
  );
}
