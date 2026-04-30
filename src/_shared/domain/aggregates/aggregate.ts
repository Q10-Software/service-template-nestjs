export abstract class Aggregate<Entity> {
  protected readonly _entity: Entity;

  constructor(entity: Entity) {
    this._entity = entity;
  }
}
