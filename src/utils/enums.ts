export enum DeviceStatus {
  REDY = 0,
  NEW = 1,
  BROKEN = 2,
}
// export enum StatusTypes {
//   OK = 'Na fila',
//   FAIL = 'Com Defeito',
//   PRINTED = 'Impresso'
// }

export const status_texts = [
  'Sem defeito',
  'Novo',
  'Com defeito'
]

export function getStatusText(status: DeviceStatus) {
  return status_texts[status]
}