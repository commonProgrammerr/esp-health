export default function genId() {
  const time = Date.now()
  return (Math.random() * time * 10e10).toString(36)
}
