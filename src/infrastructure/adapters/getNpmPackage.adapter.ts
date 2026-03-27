import { Injectable } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { INpmPackage } from '@context/appInfo/application/interfaces/npmPackage.interface';
import { IGetNpmPackagePort } from '@context/appInfo/application/ports/getNpmPackage.port';
import { join } from 'node:path';

@Injectable()
export class GetNpmPackageAdapter implements IGetNpmPackagePort {
  private readonly npmPackageData: INpmPackage;

  constructor() {
    this.npmPackageData = this.getNpmPackageData();
  }

  execute(): INpmPackage {
    return this.npmPackageData;
  }

  private getNpmPackageData(): INpmPackage {
    const npmPackageData = readFileSync(
      join(process.cwd(), 'package.json'),
      'utf-8',
    );

    return JSON.parse(npmPackageData) as INpmPackage;
  }
}
