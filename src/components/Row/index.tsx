import LogDialog from "../LogDialog";
import Link from "next/link";
import styles from "./styles.module.css";

import { PrintIcon } from "../PrintIcon";
import { DeviceStatus, getStatusText } from "@/utils/enums";
import { formatDate } from "@/utils/formatDate";
import { Device } from "@/models";

export interface RowProps {
  data: Device;
}

export function Row({ data }: RowProps) {
  const { id, status, updated_at } = data;

  return (
    <div className={styles.container}>
      <span></span>
      <span>{id}</span>
      <span>{formatDate(new Date(updated_at))}</span>
      <span>{getStatusText(status)}</span>
      <div className={styles.row_action}>
        {data.status !== DeviceStatus.BROKEN && (
          <Link href={`/api/print?id=${id}`} type="button">
            <PrintIcon />
          </Link>
        )}
        <LogDialog testeId={id!} />
      </div>
    </div>
  );
}
