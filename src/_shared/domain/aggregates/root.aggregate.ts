import { Aggregate } from './aggregate';
import { IRootEntity } from '../interfaces/root.entity';

export class RootAggregate<Entity extends IRootEntity> extends Aggregate<Entity> {

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
