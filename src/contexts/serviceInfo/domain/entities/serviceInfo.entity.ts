export interface IServiceInfo {
  status: 'ok';
  name: string;
  version: string;
  startedAt: Date;
}

export interface CreateServiceInfoProps extends IServiceInfo {
  name: string;
}
