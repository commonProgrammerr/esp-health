import { device_status } from "@/entities/Device";
import React from "react";

declare type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

declare type PropsOf<T extends (props: any) => any> = T extends (
  props: infer P
) => any
  ? P
  : never;

declare interface WhereClause {
  columnName?: string;
  iniValue: any;
  endValue: any;
  values?: any[];
  columnType?: ColumnType;
  columnMatch?: ColumnMatch;
  columnOperator?: ColumnOperator;
  columnOrder?: ColumnOrder;
  ignoreCase?: Boolean;
}



export interface IDevicesFilter {
  status?: string;
  nstatus?: string;
  pass_only?: boolean;
}

export interface IDevicesRequest {
  page_size?: number
  page_number?: number
  filter?: IDevicesFilter
}

export interface IDevicesResponse {
  date: string
  devices: IDeviceData[]
}

export interface IDeviceData {
  id: string
  device_id: string
  updated_at: Date
  status: device_status
}

export interface TrialAPIResponseOk {
  deviceTrialInfo: {
    id: string,
    startedAt?: Date | null,
    tempoTrial: number,
    permiteLog: boolean,
    deviceId: string,
    updatedAt: string,
    createdAt: string,
    deleted: boolean,
    status: string //"ACTIVE"
  }
}
export interface TrialAPIResponseFail {
  statusCode: number,
  message: string
}
