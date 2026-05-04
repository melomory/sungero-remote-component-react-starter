import type { IRemoteControlInfo, Theme } from '@directum/sungero-remote-component-types';
import type { SupportedCulture } from '@/i18n/cultures';
import type { SandboxHostModel } from '@/standalone/types';
import { createEntityBuilder } from '../entity/entity-builder';
import { createHostCardApiStub } from '../host-api.stub';
import { createHostContextStub } from '../host-context.stub';

// import type { SandboxHostModel } from '@/standalone/control-registry';
// import { createHostApiStub } from '../api/create-host-api';
// import { createHostContextStub } from '../context/create-host-context';
// import { createEntityBuilder } from '../entity/entity-builder';

function getTextDisplayValue(culture: SupportedCulture): string {
  return culture === 'ru' ? 'Строковый контрол' : 'String control';
}

export function createHostModel(culture: SupportedCulture, theme: Theme): SandboxHostModel {
  const context = createHostContextStub(culture, theme);

  const entity = createEntityBuilder()
    .withId(1)
    .withDisplayValue('Test Entity')
    .withStringProperty('Text', getTextDisplayValue(culture), 'Hello from string.')
    .build(context);

  const controlInfo: IRemoteControlInfo = {
    propertyName: 'Text',
  };

  const api = createHostCardApiStub(context, entity);

  return {
    context,
    api,
    controlInfo,
  };
}
