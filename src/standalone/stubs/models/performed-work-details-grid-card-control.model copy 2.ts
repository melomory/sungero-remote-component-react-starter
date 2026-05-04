import type { IRemoteControlInfo, Theme } from '@directum/sungero-remote-component-types';
import type { SupportedCulture } from '@/i18n/cultures';
import type { SandboxHostModel } from '@/standalone/types';
import { createChangeNotifier } from '../change-notifier';
import { createPerformedWorkDetailsEntityFixture } from '../fixtures/performed-work-details-grid.fixture';
import { createHostCardApiStub } from '../host-api.stub';
import { createHostContextStub } from '../host-context.stub';

export function createHostModel(culture: SupportedCulture, theme: Theme): SandboxHostModel {
  const context = createHostContextStub(culture, theme);
  const notifier = createChangeNotifier();
  const entity = createPerformedWorkDetailsEntityFixture(context, notifier);

  // createEntityBuilder()
  //   .withId(1)
  //   .withDisplayValue('Test Entity')
  //   .withCustomProperty('PerformedWorkDetails', 'collection', getTextDisplayValue(culture), [
  //     {
  //       Id: 42,
  //       DisplayValue: 'Child Entity',
  //       Title: 'Work',
  //       JobKind: 1,
  //       Duration: 8,
  //       Comment: 'Работал',
  //     },
  //     {
  //       Id: 43,
  //       DisplayValue: 'Child Entity',
  //       Title: 'Work',
  //       JobKind: 1,
  //       Duration: 5,
  //       Comment: 'Работал',
  //     },
  //   ])
  //   .build(context);

  const controlInfo: IRemoteControlInfo = {
    propertyName: 'PerformedWorkDetails',
  };

  const api = createHostCardApiStub(context, entity);

  return {
    context,
    api,
    controlInfo,
  };
}
