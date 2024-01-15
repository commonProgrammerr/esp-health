
export function formatDate(date: Date) {
  const dia = date.getDate().toString().padStart(2, "0");
  const mes = ((date.getMonth() || 0) + 1).toString().padStart(2, "0");
  const ano = date.getFullYear();
  const hor = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");
  const sec = date.getSeconds().toString().padStart(2, "0");

  return `${dia}-${mes}-${ano} ${hor}:${min}:${sec}`
}