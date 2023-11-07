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
  const dia = date_label?.getDate().toString().padStart(2, "0");
  const mes = ((date_label?.getMonth() || 0) + 1).toString().padStart(2, "0");
  const ano = date_label?.getFullYear();
  const hor = date_label?.getHours().toString().padStart(2, "0");
  const min = date_label?.getMinutes().toString().padStart(2, "0");
  const sec = date_label?.getSeconds().toString().padStart(2, "0");

  return (
    <div className={styles.row}>
      <span></span>
      <span>{mac}</span>
      <span>{`${dia}-${mes}-${ano} ${hor}:${min}:${sec}`}</span>
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
