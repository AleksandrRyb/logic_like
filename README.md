## Logic Like — modular monolith (server + client)

### Кратко
Проект состоит из backend (`server`, Express + TypeScript + Drizzle + PostgreSQL) и frontend (`client`, Vite + React + Tailwind). В Docker Compose поднимаются три сервиса: `db`, `server`, `client`. Сервер при старте ждёт базу, применяет миграции и выполняет сидинг.

### Стек
- Backend:
  - Node.js 20, Express 5, TypeScript
  - Drizzle ORM (PostgreSQL), `drizzle-kit` для миграций
  - Pino + pino-http для логирования
  - ts-node-dev для дев-режима
  - Biome для форматирования/линтинга
- Frontend:
  - Vite + React + TypeScript
  - Tailwind CSS v4
  - TanStack Query, axios
  - lucide-react (иконки)
  - Biome для форматирования/линтинга
- DevOps:
  - Dockerfile для `server` и `client`
  - docker-compose (db + server + client)

### Требования
- Docker + Docker Compose (для быстрого старта)
- Либо локально: Node.js 20+, PostgreSQL 16+

### Быстрый старт (Docker)
1) В корне проекта:
```bash
docker compose up --build
```
2) Откройте клиент: `http://localhost:5173`

Что происходит при старте:
- `db` поднимает PostgreSQL с базовыми креденшелами
- `server` ждёт доступность `db`, затем:
  - применяет миграции (`npm run drizzle:migrate`)
  - запускает сидер (`npm run seed`)
  - стартует dev-сервер на 3000
- `client` запускает Vite dev сервер на 5173 и проксирует `/api` на `server:3000`

Остановить:
```bash
docker compose down
```

### Локальная разработка (без Docker)
1) Поднимите PostgreSQL (локально) и создайте БД `logic_like` (или укажите свою строку подключения в `server/.env`).
2) Backend:
```bash
cd server
npm install
# настройте .env при необходимости (DATABASE_URL, PORT)
npm run drizzle:migrate
npm run seed
npm run dev
```
Сервер: `http://localhost:3000`

3) Frontend (в другом терминале):
```bash
cd client
npm install
npm run dev
```
Клиент: `http://localhost:5173`

### Переменные окружения
- `server`:
  - `DATABASE_URL` — строка подключения к PostgreSQL (по умолчанию: `postgres://postgres:postgres@localhost:5432/logic_like`)
  - `PORT` — порт сервера (по умолчанию: 3000)
  - `LOG_LEVEL` — уровень логирования pino (`info` по умолчанию)
- `client`:
  - При запуске в Docker прокси настроен на `http://server:3000`. Локально прокси идёт на `http://localhost:3000`.

### Скрипты (server)
```bash
# дев-сервер
npm run dev
# сборка TS
npm run build && npm start
# миграции drizzle
npm run drizzle:generate
npm run drizzle:migrate
# сидинг
npm run seed
# формат/линт biome
npm run format
npm run lint
```

### API (коротко)
- `GET /health` — healthcheck
- `GET /api/ideas` — список идей c полем `hasVoted`, отсортирован по `votesCount desc`
- `POST /api/ideas/:id/vote` — голос за идею
  - Лимит: не более 10 голосов с одного IP адреса, один голос на идею
  - Ошибки: 409 `Vote limit exceeded` или `Already voted`

### Важные детали
- Сервер настроен на работу за reverse-proxy: `app.set("trust proxy", true)`, IP определяется из `X-Forwarded-For`.
- Миграции/сидинг запускаются автоматически в контейнере сервера через `server/docker/entrypoint.sh`.
- Клиент использует TanStack Query для загрузки/мутации.
- В UI реализованы состояния загрузки/ошибок, кнопка голосования дизейблится только для выбранного элемента во время запроса.

### Траблшутинг
- Vite показывает в Network запрос на `http://localhost:5173/api/...` — это нормально: браузер стучится в dev-сервер, который проксирует на backend.
- Если в Docker клиент не видит сервер:
  - убедитесь, что compose поднят целиком (`db`, `server`, `client`)
  - пересоберите клиент после изменения прокси/env: `docker compose up --build client`
- Проблемы с миграциями Drizzle: проверьте `server/drizzle/meta/_journal.json` (должен быть валидным JSON) и переменную `DATABASE_URL`.


