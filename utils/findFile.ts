import { readdir } from "fs/promises";
import path from "path";



export async function findFile(fileName: string, dirPath: string) {
  const base_path = path.resolve(dirPath)
  const files = await readdir(base_path)
  return files.filter(file => {
    console.log(file, file.includes(fileName))
    return file.includes(fileName)
  })
}