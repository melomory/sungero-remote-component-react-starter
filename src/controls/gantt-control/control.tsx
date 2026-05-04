/**
 * @file Container-компонент remote control.
 *
 * Отвечает за интеграцию с host API, обработку context/controlInfo,
 * синхронизацию состояния и передачу подготовленных данных в view-компонент.
 */

import type {
  ControlUpdateHandler,
  IRemoteComponentApi,
  IRemoteComponentContext,
} from '@directum/sungero-remote-component-types';
import type { Task } from 'gantt-task-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultCulture, type SupportedCulture } from '@/i18n/cultures';
import { dataSource } from './gantt-data-source';
import ControlView from './view';

/**
 * Параметры контейнерного компонента remote control.
 */
interface IProps {
  /** Начальный контекст, переданный host-приложением. */
  initialContext: IRemoteComponentContext;
  /** API взаимодействия с карточкой и сущностью host-приложения. */
  api: IRemoteComponentApi;
}

/**
 * Пример remote control с диаграммой Ганта.
 *
 * Что демонстрирует пример:
 * - получение данных из host API;
 * - реакцию на обновления контекста и сущности;
 * - преобразование host-модели в UI-модель;
 * - передачу событий изменения обратно в host API.
 *
 * Ответственность компонента:
 * - получение и обновление данных;
 * - вычисление производного состояния;
 * - настройка локализации и поведения;
 * - передача подготовленных props в view-компонент.
 *
 * UI-рендеринг вынесен в `<ControlView />`.
 *
 * Примечание:
 * в template-репозитории часть типизации и бизнес-логики упрощена
 * для демонстрации общей схемы интеграции.
 */
const GanttControl = ({ initialContext, api }: IProps) => {
  // Начальный контекст приходит при инициализации.
  // При дальнейших обновлениях заменяем его актуальной версией.
  const [context, setContext] = useState(initialContext);

  // Культура host-контекста используется как источник языка для локализации контрола.
  const currentCulture = (context?.currentCulture as SupportedCulture) ?? defaultCulture;
  const { i18n } = useTranslation('remoteComponent');
  // Синхронизируем язык i18next с языком host-контекста.
  useEffect(() => {
    i18n.changeLanguage(currentCulture);
  }, [currentCulture, i18n]);

  /**
   * Обработчик обновления, вызываемый host-приложением.
   *
   * При обновлении перечитываем сущность из API и,
   * если передан новый контекст, обновляем и его.
   */
  const handleControlUpdate: ControlUpdateHandler = useCallback((updatedContext) => {
    // Устанавливаем в state актуальный контекст.
    if (updatedContext) {
      setContext(updatedContext);
    }
  }, []);
  api.onControlUpdate = handleControlUpdate;

  // Инициализируем данные контрола данными из хоста.
  const tasks = dataSource.map<Task>((l) => ({
    start: l.start,
    end: l.end,
    name: l.name,
    id: l.name,
    type: 'task',
    progress: l.progress,
    isDisabled: true,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
  }));

  return <ControlView tasks={tasks} />;
};

export default GanttControl;
