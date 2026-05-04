/**
 * @file Инициализация webpack public path из атрибута текущего script-тега.
 *
 * Если script, который загрузил текущий бандл, содержит поле `publicPath`,
 * это значение используется для задания `__webpack_public_path__`.
 *
 * Такой подход позволяет динамически определить базовый путь загрузки
 * чанков и других ассетов во время выполнения, а не на этапе сборки.
 */

/**
 * Расширение стандартного `HTMLScriptElement` дополнительным runtime-полем
 * `publicPath`, которое может быть установлено внешним загрузчиком.
 */
type ScriptWithPublicPath = HTMLScriptElement & {
  publicPath?: string;
};

const currentScript = document.currentScript as ScriptWithPublicPath | null;
if (currentScript?.publicPath) {
  __webpack_public_path__ = currentScript.publicPath;
}
