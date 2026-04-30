import { ServiceName } from '../valueObjects/serviceName.vo';
import { ServiceStartedAt } from '../valueObjects/serviceStartedAt.vo';
import { ServiceStatus } from '../valueObjects/serviceStatus.vo';
import { ServiceVersion } from '../valueObjects/serviceVersion.vo';

export interface IServiceInfo {
  status: ServiceStatus;
  name: ServiceName;
  version: ServiceVersion;
  startedAt: ServiceStartedAt;
}

export interface CreateServiceInfoProps {
  status: string;
  name: string;
  version: string;
  startedAt: Date;
}
