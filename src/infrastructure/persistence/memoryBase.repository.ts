import { RootAggregate } from '@context/_shared/domain/aggregates/root.aggregate';
import { IRootEntity } from '@context/_shared/domain/interfaces/root.entity';
import { IRootRepository } from '@context/_shared/domain/repositories/root.repository';
import { IDocumentRootEntity } from '@infrastructure/_shared/persistence/interfaces/doc.root';

export abstract class MemoryBaseRepository<
  D extends IDocumentRootEntity,
  A extends RootAggregate<IRootEntity>,
> implements IRootRepository<A> {
  private readonly store = new Map<string, D>();

  create(aggregate: A): A {
    if (this.store.has(aggregate.id)) {
      throw new Error(
        `Entity with id "${String(aggregate.id)}" already exists`,
      );
    }

    const document = this.toDocument(aggregate);

    this.store.set(document.id, document);

    return aggregate;
  }

  findById(id: A['id']): A | undefined {
    const document = this.store.get(id);
    return document ? this.toAggregate(document) : undefined;
  }

  findAll(): A[] {
    const documents = Array.from(this.store.values());
    return documents.map((document) => this.toAggregate(document));
  }

  update(aggregate: A): A | undefined {
    const document = this.toDocument(aggregate);
    this.store.set(document.id, document);
    return aggregate;
  }

  delete(id: A['id']): boolean {
    return this.store.delete(id);
  }

  has(id: A['id']): boolean {
    return this.store.has(id);
  }

  count(): number {
    return this.store.size;
  }

  abstract toDocument(_aggregate: A): D;
  abstract toAggregate(_document: D): A;
}
