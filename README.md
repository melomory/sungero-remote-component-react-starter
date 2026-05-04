# Sungero Remote Component React Starter

Шаблон для создания Sungero Remote Components на React и TypeScript для DirectumRX.

## Обзор

Данный репозиторий содержит стартовую структуру для разработки remote-контролов и standalone-песочницы с использованием:

- React 17 + TypeScript
- Webpack 5 с Module Federation
- генерации метаданных Sungero Remote Component
- локализации на i18next
- подготовки host-ассетов для интеграции с DirectumRX

## Возможности

- Точка входа remote-компонента: `src/federation/component.loaders.ts`
- Генерация runtime-метаданных из `config/component.manifest.js`
- Standalone-песочница для разработки: `src/standalone`
- Поддержка hot reload для standalone dev-server
- Обработка CSS и изображений
- Разделяемые зависимости React для интеграции с host

## Структура проекта

- `config/` – конфигурация webpack и manifest-компонента
  - `component.manifest.js` – описание метаданных компонента, контролов и загрузчиков
  - `webpack/` – конфиги сборки для remote и standalone
- `scripts/` – вспомогательные скрипты
  - `generate-component-metadata.js` – генерирует `src/generated/component-metadata.generated.ts`
  - `watch-component-metadata.js` – следит за изменениями manifest и перегенерирует метаданные
  - `prepare-host-assets.js` – копирует host-ассеты из `host-assets-source` в `public/host-assets`
- `src/` – исходный код приложения
  - `federation/` – entrypoints remote-компонента и управление publicPath
  - `standalone/` – песочница для локальной разработки
  - `controls/` – примеры React-контролов и их представлений
  - `i18n/` – конфигурация и ресурсы локализации
  - `generated/` – сгенерированные метаданные runtime
- `public/` – статические файлы для standalone-приложения и host-ассетов
- `host-assets-source/` – исходные CSS-ассеты host, копируемые в `public/host-assets`

## Требования

- Node.js 18+ или совместимая актуальная LTS версия
- npm

## Установка

```bash
npm install
```

## Скрипты

### Разработка

- `npm run build:standalone:dev`
  - Подготавливает host-ассеты
  - Генерирует метаданные компонента
  - Запускает Webpack в режиме наблюдения для standalone-сборки
- `npm run start:standalone:dev`
  - Подготавливает host-ассеты
  - Генерирует метаданные компонента
  - Запускает standalone dev-server
- `npm run watch:remote`
  - Сборка remote-пакета в режиме наблюдения

### Производственная сборка

- `npm run build:remote`
  - Собирает production-версию remote-компонента
- `npm run prepare:host-assets`
  - Копирует host-ассеты из `host-assets-source` в `public/host-assets`
- `npm run generate:component-metadata`
  - Перегенерирует runtime-метаданные из `config/component.manifest.js`

### Качество кода

- `npm run typecheck` – проверка TypeScript без генерации файлов
- `npm run lint` – линтинг через Biome
- `npm run format` – форматирование через Biome
- `npm run check` – проверка через Biome
- `npm run check:write` – проверка и исправление через Biome

## Как это работает

### Remote-компонент

Remote-бандл настраивается в `config/webpack/webpack.remote.js`.
Он использует `ModuleFederationPlugin` для экспорта:

- `loaders` из `src/federation/component.loaders.ts`
- `publicPath` из `src/federation/public-path.ts`

Сборка также использует плагин `@directum/sungero-remote-component-metadata-plugin` для генерации метаданных, необходимых runtime-хосту.

### Генерация метаданных компонента

`config/component.manifest.js` описывает все контролы, загрузчики и локализованные названия.
Скрипт `scripts/generate-component-metadata.js` загружает manifest и пишет сгенерированный TypeScript-файл в `src/generated/component-metadata.generated.ts`.

### Standalone-песочница

Основной entrypoint песочницы: `src/standalone/main.tsx`, где рендерится `SandboxApp` из `src/standalone/sandbox-app.tsx`.
Песочница инициализирует локализацию и запускает локальный dev-server для итеративной разработки UI.

## Настройка

- Добавляйте или изменяйте контролы в `config/component.manifest.js`
- Реализуйте новые загрузчики в `src/loaders/`
- Регистрируйте загрузчики в `src/federation/component.loaders.ts`
- Добавляйте ресурсы локализации в `src/i18n/resources/`

## Примечания

- `package.json` помечен как `private: true`, репозиторий предназначен для внутренней разработки компонентов.
- Проект использует React как разделяемую зависимость, чтобы host и remote-бандл работали с одной копией React.

## Вклад в проект

Перед отправкой Pull Request ознакомьтесь с [CONTRIBUTING.md](./CONTRIBUTING.md)

## Лицензия

Проект распространяется под лицензией MIT.
См. файл [LICENSE](./LICENSE).
