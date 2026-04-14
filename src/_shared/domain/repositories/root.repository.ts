import { IRootEntity } from '../interfaces/root.entity';
import { RootAggregate } from '../aggregates/root.aggregate';

export interface IRootRepository<Aggregate extends RootAggregate<IRootEntity>> {
  create(aggregate: Aggregate): Aggregate;
  findById(id: Aggregate['id']): Aggregate | undefined;
  findAll(): Aggregate[];
  update(aggregate: Aggregate): Aggregate | undefined;
  delete(id: Aggregate['id']): boolean;
  count(): number;
}
