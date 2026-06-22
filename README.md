# Beast PC

Сайт Beast PC с React/Vite-клиентом и Directus/PostgreSQL-бэкендом.

## Структура

- `client` — frontend.
- `backend` — Directus и локальная конфигурация PostgreSQL.

## Запуск

```bash
npm install --prefix client
npm install --prefix backend
npm run backend:start
npm run dev
```

- Сайт: http://127.0.0.1:5173/
- Directus: http://127.0.0.1:8055/admin/

Создайте `client/.env` и `backend/.env` на основе соответствующих `.env.example`.
