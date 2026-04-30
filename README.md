# NestJS DDD Service Template

A production-ready NestJS template built around **Domain-Driven Design (DDD)** and **Clean Architecture** principles. It provides a structured foundation for building scalable, maintainable microservices in TypeScript with opinionated patterns for error handling, caching, validation, logging, and observability.

---

## Features

- **Domain-Driven Design** — Bounded contexts, aggregates, entities, value objects, and repository abstractions
- **Result Pattern** — Functional error handling using `Result<T, E>` instead of exceptions throughout the domain layer
- **Caching** — Redis-backed cache with custom `@CacheInvalidate()` decorator for automatic cache busting
- **Validation** — DTO validation via `class-validator`, environment schema via `joi`, and value-object-level guards
- **Structured Logging** — Pino logger with redaction, pretty-print, and log levels configurable per environment
- **Observability** — Sentry integration for error tracking/tracing, OpenTelemetry support
- **Health Checks** — `/health` endpoint via `@nestjs/terminus`
- **Standardized Responses** — Global response wrapper interceptor with opt-out via `@SkipResponseWrap()`

---

## Project Structure

```
src/
├── _shared/                        # Shared DDD building blocks
│   ├── application/
│   │   ├── ports/                  # Logger port (abstraction)
│   │   └── useCases/               # UseCase & AsyncUseCase interfaces
│   ├── domain/
│   │   ├── aggregates/             # Base Aggregate & RootAggregate classes
│   │   ├── errors/                 # DomainError base class and factory helpers
│   │   ├── repositories/           # Generic IRootRepository interface
│   │   ├── result/                 # Result<T, E> type
│   │   └── valueObjects/           # Base ValueObject class
│   └── infrastructure/
│       ├── adapters/               # Pino logger adapter
│       └── persistence/            # Generic in-memory repository base
│
├── api/                            # NestJS HTTP layer
│   ├── config/                     # App/HTTP/cache/logger factories + Joi env validation
│   ├── decorators/                 # @CacheInvalidate, @SkipResponseWrap
│   ├── filters/                    # AllExceptionsFilter
│   ├── interceptors/               # ResultCacheInterceptor, CacheInvalidateInterceptor, ResponseWrapperInterceptor
│   └── modules/                    # Feature modules (app, pets, health, logging, serviceInfo)
│
├── contexts/                       # Bounded contexts (business logic lives here)
│   └── pets/
│       ├── application/useCases/   # CreatePet, GetPetById, ListPets, UpdatePet, DeletePet
│       └── domain/
│           ├── aggregates/         # PetAggregate
│           ├── errors/             # Pet-specific DomainErrors
│           ├── repositories/       # IPetRepository interface
│           └── valueObjects/       # PetName, PetBirthDate, PetBreed
│
└── infrastructure/                 # Infrastructure implementations
    └── persistence/pets/           # PetMemoryRepository
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10
- Redis (optional — required only for cache to persist; falls back gracefully in dev)

### Installation

```bash
npm install
cp .env.example .env
```

### Running the Application

```bash
# Development
npm run start

# Development with watch mode
npm run start:dev

# Production
npm run start:prod
```

### Running Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## Configuration

All configuration is driven by environment variables. Copy `.env.example` to `.env` and adjust as needed:

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Environment (`development`, `production`) | `development` |
| `APP_NAME` | Service name used in logs and responses | — |
| `APP_VERSION` | Service version | — |
| `PORT` | HTTP port | `3000` |
| `LOG_LEVEL` | Pino log level (`debug`, `info`, `warn`, `error`) | `info` |
| `LOG_PRETTY` | Enable pretty-print logging | `false` |
| `LOG_INCLUDE_STACK` | Include stack traces in logs | `false` |
| `LOG_REDACT_PATHS` | Comma-separated paths to redact from logs | — |
| `SENTRY_DSN` | Sentry project DSN for error tracking | — |
| `SENTRY_TRACES_SAMPLE_RATE` | Sentry tracing sample rate (0–1) | `1` |

---

## Usage Examples

### Defining a Value Object

Value objects validate their own invariants. An invalid value returns an `Err` result rather than throwing.

```typescript
// src/contexts/pets/domain/valueObjects/PetName.ts
import { ValueObject } from '@shared/domain/valueObjects/ValueObject';
import { Result, Ok, Err } from '@shared/domain/result/Result';

export class PetName extends ValueObject<string> {
  static create(value: string): Result<PetName, DomainError> {
    if (!value || value.trim().length === 0) {
      return Err(petsErrors.invalidName('Name cannot be empty'));
    }
    if (value.length > 100) {
      return Err(petsErrors.invalidName('Name cannot exceed 100 characters'));
    }
    return Ok(new PetName(value.trim()));
  }
}
```

### Defining an Aggregate

Aggregates are the entry points for domain business logic. The `create` factory method validates all inputs and returns a `Result`.

```typescript
// src/contexts/pets/domain/aggregates/PetAggregate.ts
export class PetAggregate extends RootAggregate<IPet> {
  static create(props: CreatePetProps): Result<PetAggregate, DomainError> {
    const nameResult = PetName.create(props.name);
    if (nameResult.isErr()) return Err(nameResult.error);

    const birthDateResult = PetBirthDate.create(props.birthDate);
    if (birthDateResult.isErr()) return Err(birthDateResult.error);

    return Ok(new PetAggregate({
      id: uuid(),
      name: nameResult.value,
      birthDate: birthDateResult.value,
      breed: props.breed,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }
}
```

### Implementing a Use Case

Use cases orchestrate domain logic and infrastructure. They consume a repository and return a `Result`.

```typescript
// src/contexts/pets/application/useCases/CreatePetUseCase.ts
@Injectable()
export class CreatePetUseCase implements AsyncUseCase<CreatePetDto, Result<PetAggregate, DomainError>> {
  constructor(
    @Inject(PET_REPOSITORY) private readonly petRepository: IPetRepository,
  ) {}

  async execute(dto: CreatePetDto): Promise<Result<PetAggregate, DomainError>> {
    const petResult = PetAggregate.create(dto);
    if (petResult.isErr()) return Err(petResult.error);

    await this.petRepository.save(petResult.value);
    return Ok(petResult.value);
  }
}
```

### Creating a Controller

Controllers call use cases and return `Result` values. The `AllExceptionsFilter` and `ResponseWrapperInterceptor` handle the rest.

```typescript
// src/api/modules/pets/PetsController.ts
@Controller('pets')
@UseInterceptors(ResultCacheInterceptor, CacheInvalidateInterceptor)
export class PetsController {
  constructor(private readonly createPet: CreatePetUseCase) {}

  @Post()
  @CacheInvalidate('/pets')
  async create(@Body() body: CreatePetBodyDto) {
    return this.createPet.execute(body);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getPetById.execute({ id });
  }
}
```

---

## API Endpoints

The template ships with a fully functional **Pets** example that demonstrates all DDD layers end-to-end.

| Method | Path | Description | Cache |
|---|---|---|---|
| `POST` | `/pets` | Create a new pet | Invalidates `/pets` |
| `GET` | `/pets` | List all pets | Cached |
| `GET` | `/pets/:id` | Get a pet by ID | Cached |
| `PUT` | `/pets/:id` | Update a pet | Invalidates `/pets`, `/pets/:id` |
| `DELETE` | `/pets/:id` | Delete a pet | Invalidates `/pets`, `/pets/:id` |
| `GET` | `/health` | Health check | — |

### Example Request & Response

**Create a pet:**
```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -d '{ "name": "Rex", "birthDate": "2020-05-10", "breed": "Labrador" }'
```

```json
{
  "data": {
    "id": "a1b2c3d4-...",
    "name": "Rex",
    "birthDate": "2020-05-10T00:00:00.000Z",
    "breed": "Labrador",
    "createdAt": "2026-04-30T12:00:00.000Z",
    "updatedAt": "2026-04-30T12:00:00.000Z"
  },
  "statusCode": 201
}
```

**Validation error:**
```json
{
  "statusCode": 422,
  "error": "INVALID_PET_NAME",
  "message": "Name cannot exceed 100 characters",
  "context": "PetAggregate"
}
```

---

## Adding a New Bounded Context

1. **Create the domain layer** under `src/contexts/<context>/domain/`:
   - Define the entity interface
   - Implement value objects extending `ValueObject<T>`
   - Build the aggregate extending `RootAggregate<T>`
   - Define domain errors using the `DomainError` factory
   - Declare the repository interface using `IRootRepository<Aggregate>`

2. **Create the application layer** under `src/contexts/<context>/application/useCases/`:
   - Implement one use case class per operation
   - Each implements `AsyncUseCase<Input, Result<Output, DomainError>>`

3. **Create the infrastructure layer** under `src/infrastructure/persistence/<context>/`:
   - Implement the repository interface (in-memory, TypeORM, Prisma, etc.)

4. **Create the NestJS module** under `src/api/modules/<context>/`:
   - Controller, DTOs, and the feature module wiring use cases + repository

---

## License

MIT
