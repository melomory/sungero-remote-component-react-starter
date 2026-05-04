import type {
  IRemoteComponentApi,
  IRemoteComponentContext,
  IRemoteControlInfo,
} from '@directum/sungero-remote-component-types';

export type SandboxHostModel = {
  context: IRemoteComponentContext;
  api: IRemoteComponentApi;
  controlInfo: IRemoteControlInfo;
};
