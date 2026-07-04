# Учёт времени · Битрикс24

Личный дашборд затреканного времени по задачам Битрикс24: сколько времени списано за сегодня, неделю, месяц или за всё время — итог, среднее за рабочий день, количество рабочих дней и задач в работе.

Данные берутся из REST API Битрикс24 через входящий вебхук. Вебхук живёт только на сервере (route handlers Next.js) и в браузер не попадает.

## Стек

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19
- [Redux Toolkit](https://redux-toolkit.js.org) + react-redux (стор создаётся per-request через `makeStore`)
- Tailwind CSS 4

## Запуск

1. Создайте входящий вебхук в Битрикс24: **Разработчикам → Другое → Входящий вебхук**.

   В настройке прав вебхука обязательно выдайте доступ к **задачам — `task`** (методы `task.elapseditem.getlist` и `tasks.task.list`) и **пользователям — `user`** (метод `profile`). Без права `task` отчёт вернёт ошибку доступа.

2. Положите его в `.env.local` в корне проекта (слеш в конце обязателен):

   ```
   B24_WEBHOOK=https://ваш-портал.bitrix24.ru/rest/123/xxxxxxxxxxxxxxxx/
   ```

3. Установите зависимости и запустите dev-сервер:

   ```bash
   npm install
   npm run dev
   ```

4. Откройте [http://localhost:3000](http://localhost:3000).

Отчёт строится по пользователю, которому принадлежит вебхук.

## Как устроено

```
src/
├── app/
│   ├── api/b24/          # серверные прокси к Битрикс24 (вебхук не уходит на клиент)
│   │   ├── profile/      # GET /api/b24/profile — текущий пользователь
│   │   └── time/         # GET /api/b24/time?period=today|week|month|all — агрегат
│   ├── layout.js         # шапка, футер, StoreProvider
│   └── page.js           # дашборд
├── lib/b24.js            # REST-клиент: вызов методов, пагинация через batch, сборка отчёта
├── store/                # Redux: profile, filter (выбранный период), time (отчёт)
├── widgets/              # header, footer, contentHeader (карточки статистики)
├── entities/             # кнопка фильтра, карточки
└── shared/               # список периодов, форматирование времени
```

Используемые методы REST: `profile`, `task.elapseditem.getlist` (записи учёта времени, с обходом пагинации через `batch`), `tasks.task.list` (названия задач). Агрегация считается на сервере — на клиент уезжает готовая сводка.

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | dev-сервер на :3000 |
| `npm run build` | production-сборка |
| `npm start` | запуск production-сборки |
| `npm run lint` | ESLint |
