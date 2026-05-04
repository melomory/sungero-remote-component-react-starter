/**
 * @file Реестр remote control loaders, доступных в приложении.
 *
 * Файл собирает все loader-модули в единый словарь, где:
 * - ключ — уникальное имя загрузчика;
 * - значение — реализация загрузчика
 *
 * Используется как точка регистрации remote controls
 * для последующего динамического разрешения по имени.
 */

import type { IRemoteControlLoader } from '@directum/sungero-remote-component-types';
import * as ActionsPanelControlCoverLoader from '@/loaders/actions-panel-cover-control.loader';
import * as GanttControlCoverLoader from '@/loaders/gantt-cover-control.loader';
import * as PerformedWorkDetailsGridControlCardLoader from '@/loaders/performed-work-details-grid-card-control.loader';
import * as StringControlCardLoader from '@/loaders/string-card-control.loader';

/**
 * Реестр доступных загрузчиков сторонних компонентов.
 */
const loaders: Record<string, IRemoteControlLoader> = {
  [StringControlCardLoader.loaderName]: StringControlCardLoader.createLoader,
  [PerformedWorkDetailsGridControlCardLoader.loaderName]:
    PerformedWorkDetailsGridControlCardLoader.createLoader,
  [GanttControlCoverLoader.loaderName]: GanttControlCoverLoader.createLoader,
  [ActionsPanelControlCoverLoader.loaderName]: ActionsPanelControlCoverLoader.createLoader,
};

export default loaders;
