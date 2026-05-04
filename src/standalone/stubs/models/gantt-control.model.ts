import type { IRemoteControlInfo, Theme } from '@directum/sungero-remote-component-types';
import type { SupportedCulture } from '@/i18n/cultures';
import type { SandboxHostModel } from '@/standalone/types';
import { createHostCoverApiStub } from '../host-api.stub';
import { createHostContextStub } from '../host-context.stub';

export function createHostModel(culture: SupportedCulture, theme: Theme): SandboxHostModel {
  const context = createHostContextStub(culture, theme);
  const api = createHostCoverApiStub(context);
  const controlInfo: IRemoteControlInfo = {};
  return {
    context,
    api,
    controlInfo,
  };
}
