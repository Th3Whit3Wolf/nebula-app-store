# Nebula App Store

## Install

### Install Dependencies

```bash
pnpm i
```

### Prepare Prisma

```bash
cat 'DATABASE_URL="postgresql://postgres:docker@localhost:5432/nebula?schema=public' > .env
docker compose up -d
pnpm run db:generate
pnpm run db:seed
```

## Usage

### Developer Environment

```bash
pnpm run dev
```

#### Database IDE

```bash
pnpm run db:view
```

### Production Build

```bash
pnpm run build
pnpm run start
```
