import { IRootEntity } from '../interfaces/root.entity'
import { RootAggregate } from '../aggregates/root.aggregate'
import { Result } from '../result/result'
import { ConflictError, NotFoundError } from '../errors/baseErrors'

export interface IRootRepository<Aggregate extends RootAggregate<IRootEntity>> {
  create(aggregate: Aggregate): Promise<Result<Aggregate, ConflictError>>
  findById(id: Aggregate['id']): Promise<Result<Aggregate, NotFoundError>>
  findAll(): Promise<Result<Aggregate[], never>>
  update(aggregate: Aggregate): Promise<Result<Aggregate, NotFoundError>>
  delete(id: Aggregate['id']): Promise<Result<boolean, NotFoundError>>
  count(): Promise<Result<number, never>>
}
