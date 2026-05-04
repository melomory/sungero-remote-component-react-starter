/**
 * @file Presentational-компонент remote control.
 *
 * Содержит только логику отображения и не работает напрямую с host API.
 */

import { Gantt, type Task, ViewMode } from 'gantt-task-react';
import { useTranslation } from 'react-i18next';
import 'gantt-task-react/dist/index.css';
import './control.css';

/**
 * Свойства view-компонента.
 *
 * Содержат уже подготовленные container-компонентом данные и обработчики.
 */
interface IProps {
  tasks: Array<Task>;
}

/**
 * UI-представление контрола.
 *
 * Компонент отвечает только за отображение и локальное взаимодействие с input.
 * Интеграция с host API, локализация и вычисление состояния
 * остаются в container-компоненте.
 */
const ControlView = ({ tasks }: IProps) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="gantt">
      <div className="gantt__title">{t('gantt.title')}</div>
      <Gantt tasks={tasks} locale={i18n.language} viewMode={ViewMode.HalfDay} />
    </div>
  );
};

export default ControlView;
