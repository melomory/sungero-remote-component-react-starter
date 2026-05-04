/**
 * @file Container-компонент remote control.
 *
 * Отвечает за интеграцию с host API, обработку context/controlInfo,
 * синхронизацию состояния и передачу подготовленных данных в view-компонент.
 */

import type {
  ControlUpdateHandler,
  IEntity,
  IRemoteComponentCardApi,
  IRemoteComponentContext,
  IRemoteControlInfo,
} from '@directum/sungero-remote-component-types';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultCulture, type SupportedCulture } from '@/i18n/cultures';
import ControlView from './view';

/**
 * Модель сущности со свойством.
 */
interface IEntityWithProperties extends IEntity {
  [property: string]: unknown;
}

/**
 * Параметры контейнерного компонента remote control.
 */
interface IProps {
  /** Начальный контекст, переданный host-приложением. */
  initialContext: IRemoteComponentContext;
  /** API взаимодействия с карточкой и сущностью host-приложения. */
  api: IRemoteComponentCardApi;
  /** Метаданные контрола. */
  controlInfo: IRemoteControlInfo;
}

/**
 * Пример remote control для редактирования строкового свойства сущности.
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
const StringControl = ({ initialContext, api, controlInfo }: IProps) => {
  // Имя свойства приходит из host metadata.
  // Его отсутствие означает ошибку конфигурации контрола.
  const propertyName = controlInfo.propertyName;
  if (!propertyName) throw new Error('propertyName is not defined');

  // Храним сущность в state, чтобы повторно рендерить компонент
  // после обновлений, приходящих от host-приложения.
  const [entity, setEntity] = useState(() => api.getEntity<IEntityWithProperties>());

  // Начальный контекст приходит при инициализации.
  // При дальнейших обновлениях заменяем его актуальной версией.
  const [context, setContext] = useState(initialContext);

  // Культура host-контекста используется как источник языка для локализации контрола.
  const currentCulture = (context?.currentCulture as SupportedCulture) ?? defaultCulture;
  const { t, i18n } = useTranslation('remoteComponent');
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
      setEntity(api.getEntity<IEntityWithProperties>());
      // Устанавливаем в state актуальный контекст.
      if (updatedContext) {
        setContext(updatedContext);
      }
    },
    [api]
  );

  // Подписываемся на обновления на время жизни компонента.
  useEffect(() => {
    api.onControlUpdate = handleControlUpdate;

    return () => {
      api.onControlUpdate = undefined;
    };
  }, [api, handleControlUpdate]);

  // Изменения отправляем в host-сущность через API.
  // Локальное состояние значения не ведём: источник истины находится в host.
  const handleChange = useCallback(
    async (newValue: string) => {
      await entity.changeProperty(propertyName, newValue);
    },
    [entity, propertyName]
  );

  // Контрол доступен только если сущность разрешена для редактирования
  // и не заблокирована другим пользователем/в другом контексте.
  const isLocked =
    entity.LockInfo?.IsLocked && (!entity.LockInfo.IsLockedByMe || !entity.LockInfo.IsLockedHere);
  const isEnabled = entity.State.IsEnabled && !isLocked;

  // Получаем локализованное имя свойства из metadata сущности.
  // Если metadata недоступна, используем fallback-перевод.
  const propertyInfo = entity.Info.properties.find((p) => p.name === controlInfo.propertyName);

  return (
    <ControlView
      label={propertyInfo?.displayValue ?? t('stringControl.label')}
      value={(entity[propertyName] as string) ?? undefined}
      onChange={handleChange}
      theme={context.theme}
      isEnabled={isEnabled}
    />
  );
};

export default StringControl;
