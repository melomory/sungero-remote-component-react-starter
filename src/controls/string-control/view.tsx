/**
 * @file Presentational-компонент remote control.
 *
 * Содержит только логику отображения и не работает напрямую с host API.
 */

import { Theme } from '@directum/sungero-remote-component-types';
import { useCallback, useEffect, useState } from 'react';

import './control.css';

/**
 * Свойства view-компонента.
 *
 * Содержат уже подготовленные container-компонентом данные и обработчики.
 */
interface IProps {
  /** Отображаемый заголовок поля. */
  label: string;
  /** Текущее значение, полученное от container-компонента. */
  value?: string;
  /** Обработчик сохранения значения, вызываемый при потере фокуса. */
  onChange(newValue?: string): Promise<void>;
  /** Тема host-приложения, влияющая на визуальное оформление. */
  theme: Theme;
  /** Признак доступности поля для редактирования. */
  isEnabled: boolean;
}

// Условные иконки темы используются только в демонстрационных целях.
const DEFAULT_THEME_ICON = '☀';
const NIGHT_THEME_ICON = '☾';

/**
 * UI-представление контрола.
 *
 * Компонент отвечает только за отображение и локальное взаимодействие с input.
 * Интеграция с host API, локализация и вычисление состояния
 * остаются в container-компоненте.
 */
const ControlView = ({ label, value, onChange, theme, isEnabled }: IProps) => {
  // Локальное состояние позволяет редактировать значение в input
  // и отправлять изменения наружу только при потере фокуса.
  const [editorValue, setEditorValue] = useState(value ?? '');
  const [isFocused, setIsFocused] = useState(false);

  // Если container передал новое значение извне, синхронизируем его с input.
  useEffect(() => setEditorValue(value ?? ''), [value]);

  // Сохраняем значение только если пользователь действительно его изменил.
  const handleBlur = useCallback(() => {
    if (editorValue !== value) onChange(editorValue);
    setIsFocused(false);
  }, [onChange, value, editorValue]);

  const icon = theme === Theme.Default ? DEFAULT_THEME_ICON : NIGHT_THEME_ICON;
  const controlId = 'control';

  return (
    <div className="string-control">
      <div
        className={`control-label control-label_position_left-center control-label_required-hidden ${!isEnabled ? 'control-label_disabled' : ''}`}
      >
        <label
          htmlFor={controlId}
          className="control-label__label control-label__label_position_left-center"
        >
          <span className="control-label__label-text headered-property-editor__label-text">
            {icon} {label}
          </span>
        </label>
      </div>
      <div
        className={`string-editor string-editor_bordered w-100 ${isFocused ? 'string-editor_focused' : ''} ${!isEnabled ? 'string-editor_readonly' : ''}`}
      >
        <input
          id={controlId}
          className="string-editor__input"
          type="text"
          value={editorValue}
          onBlur={handleBlur}
          onChange={(e) => setEditorValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          disabled={!isEnabled}
        />
      </div>
    </div>
  );
};

export default ControlView;
