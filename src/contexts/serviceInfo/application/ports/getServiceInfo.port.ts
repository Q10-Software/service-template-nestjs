import { GetServiceInfoPortOutput } from '../interfaces/getServiceInfoPortOutput.interface';

export const GET_SERVICE_INFO_PORT = Symbol('GET_SERVICE_INFO_PORT');

export interface GetServiceInfoPort {
  execute(): GetServiceInfoPortOutput;
}
