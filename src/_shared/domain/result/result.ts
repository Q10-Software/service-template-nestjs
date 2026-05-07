import { DomainError } from '../errors/domainError'

export class Result<T, E extends DomainError = DomainError> {
  private constructor(
    private readonly _value: T | undefined,
    private readonly _error: E | undefined,
    private readonly _isOk: boolean
  ) {}

  static ok<T>(value: T): Result<T, never> {
    return new Result<T, never>(value, undefined, true)
  }

  static fail<E extends DomainError>(error: E): Result<never, E> {
    return new Result<never, E>(undefined, error, false)
  }

  get isOk(): boolean {
    return this._isOk
  }

  get isFail(): boolean {
    return !this._isOk
  }

  get value(): T {
    if (!this._isOk) {
      throw new Error('Cannot get value from a failed Result')
    }
    return this._value as T
  }

  get error(): E {
    if (this._isOk) {
      throw new Error('Cannot get error from a successful Result')
    }
    return this._error as E
  }
}
