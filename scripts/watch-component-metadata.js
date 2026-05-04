/**
 * @file Watch-скрипт для автоматической регенерации metadata компонентов.
 *
 * Скрипт следит за изменениями файла `config/component.manifest.js`
 * и при каждом изменении повторно запускает генерацию файла
 * `component-metadata.generated.ts`.
 *
 * Используется в dev/build workflow, когда manifest может меняться
 * во время разработки.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chokidar from 'chokidar';
import { generateComponentMetadata } from './generate-component-metadata.js';

/**
 * Абсолютный путь к текущему файлу (ESM-аналог `__filename`).
 */
const CURRENT_FILE_PATH = fileURLToPath(import.meta.url);

/**
 * Абсолютный путь к директории текущего файла (ESM-аналог `__dirname`).
 */
const CURRENT_DIR_PATH = path.dirname(CURRENT_FILE_PATH);

/**
 * Абсолютный путь к manifest-файлу компонентов,
 * за которым следит watcher.
 */
const COMPONENT_MANIFEST_FILE_PATH = path.resolve(
  CURRENT_DIR_PATH,
  '../config/component.manifest.js'
);

/**
 * Префикс для логов текущего скрипта.
 */
const LOG_SCOPE = '[watch-component-metadata]';

/**
 * Выполнить повторную генерацию metadata компонентов.
 *
 * Ошибки логируются, но не пробрасываются дальше,
 * чтобы watcher продолжал работать после неуспешной генерации.
 *
 * @returns {Promise<void>}
 */
async function regenerateComponentMetadata() {
  try {
    await generateComponentMetadata();
  } catch (error) {
    console.error(`${LOG_SCOPE} Generation failed:`, error);
  }
}

/**
 * Запустить watcher manifest-файла и настраивает реакции на события.
 *
 * @returns {Promise<void>}
 */
async function watchComponentMetadata() {
  const relativeManifestPath = path.relative(process.cwd(), COMPONENT_MANIFEST_FILE_PATH);

  console.log(`${LOG_SCOPE} Watching: ${relativeManifestPath}`);

  await regenerateComponentMetadata();

  const watcher = chokidar.watch(COMPONENT_MANIFEST_FILE_PATH, {
    ignoreInitial: true,
  });

  watcher.on('change', async () => {
    console.log(`${LOG_SCOPE} Change detected, regenerating...`);
    await regenerateComponentMetadata();
  });

  watcher.on('error', (error) => {
    console.error(`${LOG_SCOPE} Watcher error:`, error);
  });
}

await watchComponentMetadata();
