/**
 * @file Подготовка host CSS assets для локального использования приложением.
 *
 * Скрипт:
 * 1. Читает CSS-файлы из `host-assets-source/css`
 * 2. Находит нужные файлы по шаблонам имён
 * 3. Копирует их в `public/host-assets/css/current`
 * 4. Переименовывает в стабильные target-имена
 *
 * Если исходная директория отсутствует или в ней нет CSS-файлов,
 * скрипт создаёт README-заглушку в целевой директории.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Абсолютный путь к текущему файлу (ESM-аналог `__filename`).
 */
const CURRENT_FILE_PATH = fileURLToPath(import.meta.url);

/**
 * Абсолютный путь к директории текущего файла (ESM-аналог `__dirname`).
 */
const CURRENT_DIR_PATH = path.dirname(CURRENT_FILE_PATH);

/**
 * Корневая директория проекта.
 */
const PROJECT_ROOT_PATH = path.resolve(CURRENT_DIR_PATH, '..');

/**
 * Исходная директория, куда вручную складываются host CSS assets.
 */
const HOST_CSS_SOURCE_DIR = path.resolve(PROJECT_ROOT_PATH, 'host-assets-source/css');

/**
 * Целевая директория, из которой приложение читает подготовленные host CSS assets.
 */
const HOST_CSS_TARGET_DIR = path.resolve(PROJECT_ROOT_PATH, 'public/host-assets/css/current');

/**
 * Набор правил сопоставления:
 * - `match` определяет, какой исходный файл искать;
 * - `targetName` задаёт стабильное имя в целевой директории.
 *
 * @type {Array<{ targetName: string; match: RegExp }>}
 */
const CSS_FILE_MAPPINGS = [
  {
    targetName: 'appStyles.css',
    match: /^appStyles_.*\.css$/i,
  },
  {
    targetName: 'scrollbar.css',
    match: /^scrollbar_.*\.css$/i,
  },
  {
    targetName: 'theme-default.css',
    match: /^theme-default_.*\.css$/i,
  },
  {
    targetName: 'theme-night.css',
    match: /^theme-night_.*\.css$/i,
  },
];

/**
 * Убедиться в существовании директории.
 *
 * @param {string} directoryPath Абсолютный или относительный путь к директории.
 */
function ensureDirectoryExists(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

/**
 * Очистить содержимое директории, не удаляя саму директорию.
 *
 * Если директория не существует, функция просто завершает выполнение.
 *
 * @param {string} directoryPath Путь к директории, которую нужно очистить.
 */
function clearDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return;
  }

  const entries = fs.readdirSync(directoryPath);

  for (const entryName of entries) {
    const entryPath = path.join(directoryPath, entryName);
    const entryStat = fs.statSync(entryPath);

    if (entryStat.isDirectory()) {
      fs.rmSync(entryPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(entryPath);
    }
  }
}

/**
 * Найти первый файл из списка, имя которого подходит под шаблон.
 *
 * @param {string[]} fileNames Список имён файлов.
 * @param {RegExp} fileNamePattern Регулярное выражение для поиска.
 * @returns {string | undefined} Найденное имя файла или `undefined`.
 */
function findFirstMatchingFile(fileNames, fileNamePattern) {
  return fileNames.find((fileName) => fileNamePattern.test(fileName));
}

/**
 * Записать README-заглушку в целевую директорию,
 * если исходные host CSS assets недоступны.
 *
 * README объясняет, где ожидаются исходные файлы
 * и какую команду нужно выполнить после их добавления.
 */
function writeSourceMissingPlaceholder() {
  ensureDirectoryExists(HOST_CSS_TARGET_DIR);

  const readmeFilePath = path.join(HOST_CSS_TARGET_DIR, 'README.txt');
  const readmeContent = [
    'Host CSS assets were not prepared.',
    '',
    'Expected source folder:',
    `${HOST_CSS_SOURCE_DIR}`,
    '',
    'Please copy host CSS files there manually and rerun:',
    '  npm run prepare:host-assets',
    '',
  ].join('\n');

  fs.writeFileSync(readmeFilePath, readmeContent, 'utf8');
}

/**
 * Получить список CSS-файлов из исходной директории.
 *
 * @param {string} sourceDirectoryPath Путь к исходной директории.
 * @returns {string[]} Список CSS-файлов.
 */
function getSourceCssFiles(sourceDirectoryPath) {
  return fs
    .readdirSync(sourceDirectoryPath)
    .filter((fileName) => fileName.toLowerCase().endsWith('.css'));
}

/**
 * Скопировать CSS-файлы из исходной директории в целевую согласно правилам маппинга.
 *
 * Для каждого target-файла:
 * - ищется первый подходящий source-файл;
 * - при наличии выполняется копирование с новым именем;
 * - при отсутствии target попадает в список missing.
 *
 * @param {string[]} sourceFileNames Имена CSS-файлов в source-директории.
 * @returns {string[]} Список target-файлов, для которых не нашёлся source.
 */
function copyMappedCssFiles(sourceFileNames) {
  const missingTargetFileNames = [];

  for (const mapping of CSS_FILE_MAPPINGS) {
    const matchedSourceFileName = findFirstMatchingFile(sourceFileNames, mapping.match);

    if (!matchedSourceFileName) {
      missingTargetFileNames.push(mapping.targetName);
      console.warn(`[prepare-host-assets] Missing source for target "${mapping.targetName}"`);
      continue;
    }

    const sourceFilePath = path.join(HOST_CSS_SOURCE_DIR, matchedSourceFileName);
    const targetFilePath = path.join(HOST_CSS_TARGET_DIR, mapping.targetName);

    fs.copyFileSync(sourceFilePath, targetFilePath);

    console.log(
      `[prepare-host-assets] Copied "${matchedSourceFileName}" -> "${mapping.targetName}"`
    );
  }

  return missingTargetFileNames;
}

/**
 * Записать JSON-отчёт с отсутствующими target-файлами.
 *
 * Используется как дополнительный артефакт диагностики,
 * если часть ожидаемых CSS-файлов не была найдена.
 *
 * @param {string[]} missingTargetFileNames Список отсутствующих target-файлов.
 */
function writeMissingFilesReport(missingTargetFileNames) {
  if (missingTargetFileNames.length === 0) {
    return;
  }

  const reportFilePath = path.join(HOST_CSS_TARGET_DIR, 'missing-files.json');
  const reportContent = {
    missing: missingTargetFileNames,
  };

  fs.writeFileSync(reportFilePath, JSON.stringify(reportContent, null, 2), 'utf8');
}

/**
 * Подготовить host CSS assets.
 */
function prepareHostAssets() {
  console.log('[prepare-host-assets] Start');

  ensureDirectoryExists(HOST_CSS_TARGET_DIR);
  clearDirectory(HOST_CSS_TARGET_DIR);

  if (!fs.existsSync(HOST_CSS_SOURCE_DIR)) {
    console.warn(`[prepare-host-assets] Source directory does not exist: ${HOST_CSS_SOURCE_DIR}`);
    writeSourceMissingPlaceholder();
    console.log('[prepare-host-assets] Done with warnings');
    return;
  }

  const sourceCssFileNames = getSourceCssFiles(HOST_CSS_SOURCE_DIR);

  if (sourceCssFileNames.length === 0) {
    console.warn(
      `[prepare-host-assets] No CSS files found in source directory: ${HOST_CSS_SOURCE_DIR}`
    );
    writeSourceMissingPlaceholder();
    console.log('[prepare-host-assets] Done with warnings');
    return;
  }

  const missingTargetFileNames = copyMappedCssFiles(sourceCssFileNames);

  writeMissingFilesReport(missingTargetFileNames);

  console.log('[prepare-host-assets] Done');
}

prepareHostAssets();
