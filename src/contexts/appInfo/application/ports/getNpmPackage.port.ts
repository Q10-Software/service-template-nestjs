import { INpmPackage } from '../interfaces/npmPackage.interface';

export const GET_NPM_PACKAGE_PORT = Symbol('GET_NPM_PACKAGE_PORT');

export interface IGetNpmPackagePort {
  execute(): INpmPackage;
}

