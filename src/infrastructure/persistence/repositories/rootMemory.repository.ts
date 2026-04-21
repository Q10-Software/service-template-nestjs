import { RootAggregate } from '@shared/domain/aggregates/root.aggregate';
import { ConflictError, NotFoundError } from '@shared/domain/errors/baseErrors';
import { IRootEntity } from '@shared/domain/interfaces/root.entity';
import { IRootRepository } from '@shared/domain/repositories/root.repository';
import { Result } from '@shared/domain/result/result';
import { IDocumentRootEntity } from '../interfaces/doc.root';

export abstract class RootMemoryRepository<
  D extends IDocumentRootEntity,
  A extends RootAggregate<IRootEntity>,
> implements IRootRepository<A> {
  private readonly store = new Map<string, D>();

  async create(aggregate: A): Promise<Result<A, ConflictError>> {
    if (this.store.has(aggregate.id)) {
      return Result.fail(
        new ConflictError({
          context: 'REPOSITORY',
          message: `Entity with id "${String(aggregate.id)}" already exists`,
        }),
      );
    }

    const document = this.toDocument(aggregate);
    this.store.set(document.id, document);

    return Result.ok(aggregate);
  }

  async findById(id: A['id']): Promise<Result<A, NotFoundError>> {
    const document = this.store.get(id);

    if (!document) {
      return Result.fail(
        new NotFoundError({
          context: 'REPOSITORY',
          message: `Entity with id "${String(id)}" not found`,
        }),
      );
    }

    return Result.ok(this.toAggregate(document));
  }

  async findAll(): Promise<Result<A[], never>> {
    const documents = Array.from(this.store.values());
    return Result.ok(documents.map((document) => this.toAggregate(document)));
  }

  async update(aggregate: A): Promise<Result<A, NotFoundError>> {
    if (!this.store.has(aggregate.id)) {
      return Result.fail(
        new NotFoundError({
          context: 'REPOSITORY',
          message: `Entity with id "${String(aggregate.id)}" not found`,
        }),
      );
    }

    const document = this.toDocument(aggregate);
    this.store.set(document.id, document);

    return Result.ok(aggregate);
  }

  async delete(id: A['id']): Promise<Result<boolean, NotFoundError>> {
    if (!this.store.has(id)) {
      return Result.fail(
        new NotFoundError({
          context: 'REPOSITORY',
          message: `Entity with id "${String(id)}" not found`,
        }),
      );
    }

    return Result.ok(this.store.delete(id));
  }

  async count(): Promise<Result<number, never>> {
    return Result.ok(this.store.size);
  }

  has(id: A['id']): boolean {
    return this.store.has(id);
  }

  abstract toDocument(_aggregate: A): D;
  abstract toAggregate(_document: D): A;
}
