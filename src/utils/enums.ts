export enum DeviceStatus {
  REDY = 0,
  NEW = 1,
  BROKEN = 2,
  PRINTED = 3
}
// export enum StatusTypes {
//   OK = 'Na fila',
//   FAIL = 'Com Defeito',
//   PRINTED = 'Impresso'
// }

export const status_texts = {
  [DeviceStatus.REDY]: 'Sem defeito',
  [DeviceStatus.NEW]: 'Novo',
  [DeviceStatus.BROKEN]: 'Com defeito',
  [DeviceStatus.PRINTED]: 'Impresso'
}

export function getStatusText(status: DeviceStatus) {
  return status_texts[status]
}

export enum EventType {
  LOG = 0,
  PRINT = 1,
  UPDATE = 2
}
