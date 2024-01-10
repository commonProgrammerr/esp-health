


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
  mac: string
  date?: Date
  status: string
}
