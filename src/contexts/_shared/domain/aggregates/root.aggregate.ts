import { IRootEntity } from '../interfaces/root.entity';

export class RootAggregate<Entity extends IRootEntity> {
  private readonly _entity: Entity;

  constructor(entity: Entity) {
    this._entity = entity;
  }

  get id(): Entity['id'] {
    return this._entity.id;
  }

  get createdAt(): Entity['createdAt'] {
    return this._entity.createdAt;
  }

  get updatedAt(): Entity['updatedAt'] {
    return this._entity.updatedAt;
  }
}
