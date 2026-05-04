import type {
  ILoaderArgs,
  IRemoteControlLoader,
  Theme,
} from '@directum/sungero-remote-component-types';
import loaders from '@/federation/component.loaders';
import * as ActionsPanelControlCoverLoader from '@/loaders/actions-panel-cover-control.loader';
import * as GanttControlCoverLoader from '@/loaders/gantt-cover-control.loader';
import * as PerformedWorkDetailsGridControlCardLoader from '@/loaders/performed-work-details-grid-card-control.loader';
import * as StringControlCardLoader from '@/loaders/string-card-control.loader';
import { createHostModel as createActionsPanelHostModel } from './stubs/models/actions-panel-control.model';
import { createHostModel as createGanttHostModel } from './stubs/models/gantt-control.model';
import { createHostModel as createPerformedWorkDetailsGridHostModel } from './stubs/models/performed-work-details-grid-card-control.model copy 2';
import { createHostModel as createStringControlHostModel } from './stubs/models/string-control.model';

export type SandboxLanguage = 'ru' | 'en';

// export type SandboxHostModel = {
//   context: IRemoteComponentContext;
//   api: IRemoteComponentCardApiExtended;
//   controlInfo: IRemoteControlInfo;
//   label: string;
// };

export type SandboxControlEntry = {
  id: string;
  name: string;
  loader?: IRemoteControlLoader;
  loaderName?: string;
  createLoaderArgs?: (
    container: HTMLElement,
    language: SandboxLanguage,
    theme: Theme
  ) => ILoaderArgs;
};

export const sandboxControls: SandboxControlEntry[] = [
  {
    id: StringControlCardLoader.controlMetadata?.Id ?? '',
    name: StringControlCardLoader.controlMetadata?.Name ?? '',
    loaderName: StringControlCardLoader.loaderName,
    loader: loaders[StringControlCardLoader.loaderName],
    createLoaderArgs: (container, culture, theme) => {
      const model = createStringControlHostModel(culture, theme);

      return {
        container,
        initialContext: model.context,
        api: model.api,
        controlInfo: model.controlInfo,
      };
    },
  },
  {
    id: PerformedWorkDetailsGridControlCardLoader.controlMetadata?.Id ?? '',
    name: PerformedWorkDetailsGridControlCardLoader.controlMetadata?.Name ?? '',
    loaderName: PerformedWorkDetailsGridControlCardLoader.loaderName,
    loader: loaders[PerformedWorkDetailsGridControlCardLoader.loaderName],
    createLoaderArgs: (container, culture, theme) => {
      const model = createPerformedWorkDetailsGridHostModel(culture, theme);

      return {
        container,
        initialContext: model.context,
        api: model.api,
        controlInfo: model.controlInfo,
      };
    },
  },
  {
    id: GanttControlCoverLoader.controlMetadata?.Id ?? '',
    name: GanttControlCoverLoader.controlMetadata?.Name ?? '',
    loaderName: GanttControlCoverLoader.loaderName,
    loader: loaders[GanttControlCoverLoader.loaderName],
    createLoaderArgs: (container, culture, theme) => {
      const model = createGanttHostModel(culture, theme);

      return {
        container,
        initialContext: model.context,
        api: model.api,
        controlInfo: model.controlInfo,
      };
    },
  },
  {
    id: ActionsPanelControlCoverLoader.controlMetadata?.Id ?? '',
    name: ActionsPanelControlCoverLoader.controlMetadata?.Name ?? '',
    loaderName: ActionsPanelControlCoverLoader.loaderName,
    loader: loaders[ActionsPanelControlCoverLoader.loaderName],
    createLoaderArgs: (container, culture, theme) => {
      const model = createActionsPanelHostModel(culture, theme);

      return {
        container,
        initialContext: model.context,
        api: model.api,
        controlInfo: model.controlInfo,
      };
    },
  },

  // {
  //   // TODO: создание host моделей
  //   id: GanttCoverControlLoader.controlId,
  //   title: 'Gantt',
  //   loaderName: GanttCoverControlLoader.loaderName,
  //   loader: GanttCoverControlLoader.default,
  //   createHostModel: createHtmlEmailEditorHostModel,
  //   renderDirect: (culture, theme) => {
  //     const model = createHtmlEmailEditorHostModel(culture, theme);

  //     return (
  //       <GanttControl
  //         initialContext={model.context}
  //         api={model.api}
  //         // controlInfo={model.controlInfo}
  //       />
  //     );
  //   },

  //   createLoaderArgs: (container, culture, theme) => {
  //     const model = createHtmlEmailEditorHostModel(culture, theme);

  //     return {
  //       container,
  //       initialContext: model.context,
  //       api: model.api,
  //       controlInfo: model.controlInfo,
  //     };
  //   },
  // },
  // {
  //   // TODO: создание host моделей
  //   id: ActionPanelLoader.controlId,
  //   title: 'Action Panel',
  //   loaderName: ActionPanelLoader.loaderName,
  //   loader: ActionPanelLoader.default,
  //   createHostModel: createHtmlEmailEditorHostModel,
  //   renderDirect: (culture, theme) => {
  //     const model = createHtmlEmailEditorHostModel(culture, theme);

  //     return <ActionsPanelControl initialContext={model.context} api={model.api} />;
  //   },

  //   createLoaderArgs: (container, culture, theme) => {
  //     const model = createHtmlEmailEditorHostModel(culture, theme);

  //     return {
  //       container,
  //       initialContext: model.context,
  //       api: model.api,
  //       controlInfo: model.controlInfo,
  //     };
  //   },
  // },
];
