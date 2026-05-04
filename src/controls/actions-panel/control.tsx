/**
 * @file Container-компонент remote control.
 *
 * Отвечает за интеграцию с host API, обработку context/controlInfo,
 * синхронизацию состояния и передачу подготовленных данных в view-компонент.
 */

import type {
  IRemoteComponentContext,
  IRemoteComponentCoverApi,
} from '@directum/sungero-remote-component-types';
import { resolveIntegrationMetadataUrl } from '@/shared/config/integration';
import ControlView from './view';

/**
 * Параметры контейнерного компонента remote control.
 */
interface IProps {
  /** Начальный контекст, переданный host-приложением. */
  initialContext: IRemoteComponentContext;
  /** API взаимодействия с обложкой host-приложения. */
  api: IRemoteComponentCoverApi;
}

/**
 * Пример remote control с панелью кнопок, запускающих действия на обложке модуля.
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
const ActionsPanelControl = ({ api }: IProps) => {
  // Получаем метаданные действий на обложке модуля с помощью API.
  const metadata = api.getActionsMetadata();

  console.log(resolveIntegrationMetadataUrl());

  const buttons = metadata.map((m) => ({
    name: m.title,
    title: m.description,
    onClick() {
      // Запускаем выполнение соответствующего действия обложки с помощью API.
      api.executeAction(m.id);
    },
  }));

  return <ControlView buttons={buttons} />;
};

export default ActionsPanelControl;
