export abstract class ValueObject<T> {
  protected constructor(protected readonly _value: T) {}

  get value(): T {
    return this._value;
  }

  equals(other: ValueObject<T>): boolean {
    return JSON.stringify(this._value) === JSON.stringify(other._value);
  }
}

export type ValueObjectStatic<T, V extends ValueObject<T>> = {
  create(value: T): V;
};
