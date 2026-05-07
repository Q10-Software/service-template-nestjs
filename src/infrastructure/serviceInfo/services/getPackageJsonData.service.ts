import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export interface IPackageJsonData {
  name: string
  version: string
}

export class GetPackageJsonDataService {
  private readonly packageJsonData: IPackageJsonData

  constructor() {
    this.packageJsonData = this.readPackageJsonData()
  }

  execute(): IPackageJsonData {
    return this.packageJsonData
  }

  private readPackageJsonData() {
    const packageJsonData = readFileSync(
      join(process.cwd(), 'package.json'),
      'utf-8'
    )
    return JSON.parse(packageJsonData) as IPackageJsonData
  }
}
