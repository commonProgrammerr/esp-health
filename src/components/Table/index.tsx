import React, { ReactNode } from "react";
import genId from "@/utils/genID";

import { Cell, Container } from "./styles";

export interface TableProps<T> {
  className?: string;
  columns: Record<keyof T, string | undefined>;
  data: Array<Record<keyof T, ReactNode>>;
}

function Table<T>({ columns, data, className }: TableProps<T>) {
  const columns_keys = Object.keys(columns).filter((key) =>
    Boolean(columns[key as keyof T])
  );
  return (
    <Container columns={columns_keys.length} className={className}>
      {columns_keys.map((column) => (
        <Cell key={column}>
          <strong>{columns[column as keyof T]}</strong>
        </Cell>
      ))}

      {data.length &&
        data.map((row) =>
          columns_keys.map((cell) => (
            <Cell key={genId()}>{row[cell as keyof T]}</Cell>
          ))
        )}
    </Container>
  );
}

export default Table;
