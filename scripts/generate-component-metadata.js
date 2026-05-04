/**
 * @file Генератор runtime-метаданных компонентов.
 *
 * Скрипт загружает manifest из `config/component.manifest.js`
 * и генерирует TypeScript-модуль:
 * `src/generated/component-metadata.generated.ts`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Абсолютный путь к текущему файлу (ESM-аналог `__filename`).
 */
const CURRENT_FILE_PATH = fileURLToPath(import.meta.url);

/**
 * Абсолютный путь к директории текущего файла (ESM-аналог `__dirname`).
 */
const CURRENT_DIR_PATH = path.dirname(CURRENT_FILE_PATH);

/**
 * Путь к исходному manifest-файлу.
 */
const MANIFEST_FILE_PATH = path.resolve(CURRENT_DIR_PATH, '../config/component.manifest.js');

/**
 * Путь к генерируемому TypeScript-файлу с runtime-метаданными.
 */
const GENERATED_OUTPUT_FILE_PATH = path.resolve(
  CURRENT_DIR_PATH,
  '../src/generated/component-metadata.generated.ts'
);

/**
 * Признак, что файл запущен напрямую через, а не импортирован как модуль.
 */
const isExecutedDirectly =
  typeof process.argv[1] === 'string' && path.resolve(process.argv[1]) === CURRENT_FILE_PATH;

/**
 * Преобразовать абсолютный путь к файлу в file:// URL
 * и добавить cache-busting query-параметр.
 *
 * Это позволяет избежать кеширования ESM-импорта при повторных запусках
 * внутри одного процесса.
 *
 * @param filePath Абсолютный путь к файлу.
 * @returns URL для динамического импорта.
 */
function createUncachedFileImportUrl(filePath) {
  return `${pathToFileURL(filePath).href}?t=${Date.now()}`;
}

/**
 * Убедиться в существовании директории для указанного файла.
 *
 * @param filePath Путь к файлу, директория которого должна существовать.
 */
function ensureParentDirectoryExists(filePath) {
  const targetDirectory = path.dirname(filePath);
  fs.mkdirSync(targetDirectory, { recursive: true });
}

/**
 * Загрузить manifest-модуль из файла конфигурации.
 *
 * Поддерживает оба варианта экспорта:
 * - `export default ...`
 * - `module.exports = ...` / именованный экспорт объекта
 *
 * @returns Загруженный manifest.
 * @throws Если модуль не удалось импортировать или он пустой.
 */
async function loadComponentManifest() {
  const manifestImportUrl = createUncachedFileImportUrl(MANIFEST_FILE_PATH);
  const importedModule = await import(manifestImportUrl);
  const manifest = importedModule.default ?? importedModule;

  if (manifest === undefined) {
    throw new Error(
      `Manifest module is empty: ${path.relative(process.cwd(), MANIFEST_FILE_PATH)}`
    );
  }

  return manifest;
}

/**
 * Сгенерировать содержимое TypeScript-модуля на основе manifest-данных.
 *
 * @param manifest Данные manifest.
 * @returns Содержимое TypeScript-файла.
 */
function buildGeneratedModuleSource(manifest) {
  const serializedManifest = JSON.stringify(manifest, null, 2);

  return `/* eslint-disable */
/* biome-ignore-all lint: generated file */

/**
 * Автоматически сгенерированный runtime-manifest компонентов.
 * Не редактируйте этот файл вручную.
 */
export const componentManifestRuntime = ${serializedManifest} as const;

export default componentManifestRuntime;
`;
}

/**
 * Записать generated TypeScript-модуль на диск.
 *
 * @param outputFilePath Абсолютный путь к выходному файлу.
 * @param fileContent Содержимое файла.
 */
function writeGeneratedFile(outputFilePath, fileContent) {
  ensureParentDirectoryExists(outputFilePath);
  fs.writeFileSync(outputFilePath, fileContent, 'utf8');
}

/**
 * Сгенерировать TypeScript-файл с runtime-метаданными компонентов.
 *
 * @returns Promise, завершающийся после успешной генерации файла.
 */
export async function generateComponentMetadata() {
  const manifest = await loadComponentManifest();
  const generatedSource = buildGeneratedModuleSource(manifest);

  writeGeneratedFile(GENERATED_OUTPUT_FILE_PATH, generatedSource);

  console.log(
    `[generate-component-metadata] Generated: ${path.relative(
      process.cwd(),
      GENERATED_OUTPUT_FILE_PATH
    )}`
  );
}

/**
 * Точка входа для CLI-сценария.
 *
 * Выполняет генерацию и печатает ошибку в stderr при неудаче, завершая процесс с кодом 1.
 */
async function runCli() {
  try {
    await generateComponentMetadata();
  } catch (error) {
    console.error('[generate-component-metadata] Failed:', error);
    process.exit(1);
  }
}

if (isExecutedDirectly) {
  void runCli();
}
