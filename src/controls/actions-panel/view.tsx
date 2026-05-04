/**
 * @file Presentational-компонент remote control.
 *
 * Содержит только логику отображения и не работает напрямую с host API.
 */

import './control.css';

export interface IButtonProps {
  name: string;
  title: string;
  onClick(): void;
}

/**
 * Свойства view-компонента.
 *
 * Содержат уже подготовленные container-компонентом данные и обработчики.
 */
interface IProps {
  buttons: Array<IButtonProps>;
}

/**
 * UI-представление контрола.
 *
 * Интеграция с host API, локализация и вычисление состояния
 * остаются в container-компоненте.
 */
const ControlView = ({ buttons }: IProps) => {
  const panelButtons = buttons.map((b) => {
    return (
      <button
        key={b.name}
        type="button"
        className="buttons-panel__button"
        title={b.title}
        onClick={b.onClick}
      >
        {b.name}
      </button>
    );
  });

  return <div className="buttons-panel">{panelButtons}</div>;
};

export default ControlView;
