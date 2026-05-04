/**
 * @file Container-компонент remote control.
 *
 * Отвечает за интеграцию с host API, обработку context/controlInfo,
 * синхронизацию состояния и передачу подготовленных данных в view-компонент.
 */

import type {
  ControlUpdateHandler,
  IRemoteComponentCardApi,
  IRemoteComponentContext,
} from '@directum/sungero-remote-component-types';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultCulture, type SupportedCulture } from '@/i18n/cultures';
import type { IPerformedWork } from './types';
import ControlView from './view';

interface IProps {
  /** Начальный контекст, переданный host-приложением. */
  initialContext: IRemoteComponentContext;
  /** API взаимодействия с карточкой и сущностью host-приложения. */
  api: IRemoteComponentCardApi;
}

/**
 * Пример remote control для отметки выполненных работ.
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
const PerformedWorkDetailsGridControl = ({ initialContext, api }: IProps) => {
  // Храним сущность в state, чтобы повторно рендерить компонент
  // после обновлений, приходящих от host-приложения.
  const [entity, setEntity] = useState<IPerformedWork>(api.getEntity<IPerformedWork>());

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
  const handleControlUpdate: ControlUpdateHandler = useCallback(
    (updatedContext) => {
      // Заново получаем актуальную сущность через API и устанавливаем в state, чтобы перерисовать компоненты контрола с актуальными данными сущности из карточки.
      setEntity(api.getEntity<IPerformedWork>());
      // Устанавливаем в state актуальный контекст.
      if (updatedContext) {
        setContext(updatedContext);
      }
    },
    [api]
  );
  api.onControlUpdate = handleControlUpdate;

  return <ControlView entity={entity} />;
};

export default PerformedWorkDetailsGridControl;
