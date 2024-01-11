import { device_status } from "@/entities/Device";



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
