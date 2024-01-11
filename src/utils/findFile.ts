import { lstatSync, readdirSync } from "fs";
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

export function findFileSync(fileName: string, dirPath: string) {
  const base_path = path.resolve(dirPath)
  const files = readdirSync(base_path)
  return files.filter(file => {
    console.log(file, file.includes(fileName))
    return file.includes(fileName)
  })
}

export async function getFiles(dirPath: string) {
  const base_path = path.resolve(dirPath)
  const files = await readdir(base_path)

  return (await Promise.all(files.map(async file => {
    const child_path = path.join(base_path, file)

    if (lstatSync(child_path).isDirectory())
      return getFiles(child_path)
    else
      return child_path
  }))).flat()

}