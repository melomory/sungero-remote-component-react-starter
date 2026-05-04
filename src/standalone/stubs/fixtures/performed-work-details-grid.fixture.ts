import type { IRemoteComponentContext } from '@directum/sungero-remote-component-types';
import type { IChangeNotifier } from '../change-notifier';
import { createChildEntityStub } from '../entity/child-entity.stub';
import {
  createChildEntityCollectionStub,
  type IChildEntityCollection,
} from '../entity/child-entity-collection.stub';
import { createEntityBuilder, type EntityWithProperties } from '../entity/entity-builder';

type JobKindValue = {
  DisplayValue: string;
};

export type PerformedWorkRootStub = EntityWithProperties & {
  PerformedWorkDetails: IChildEntityCollection<PerformedWorkRootStub, PerformedWorkDetailStub>;
};

export type PerformedWorkDetailStub = EntityWithProperties & {
  RootEntity: PerformedWorkRootStub;
  Title?: string;
  JobKind?: JobKindValue;
  Duration?: number;
  Comment?: string | null;
};

export function createPerformedWorkDetailsEntityFixture(
  context: IRemoteComponentContext,
  notifier: IChangeNotifier
): PerformedWorkRootStub {
  const rootEntity = createEntityBuilder()
    .withId(1)
    .withDisplayValue('Performed Work')
    .withCustomProperty('PerformedWorkDetails', 'collection', 'Performed work details', undefined)
    .build(context, {
      notifyChange: () => notifier.notify(),
    }) as PerformedWorkRootStub;

  const createItem = (
    root: PerformedWorkRootStub,
    nextIndex: number,
    initialValues?: Partial<PerformedWorkDetailStub>
  ): PerformedWorkDetailStub => {
    return createChildEntityStub({
      rootEntity: root,
      id: nextIndex + 1,
      displayValue: `Work ${nextIndex + 1}`,
      initialValues: {
        Title: '',
        JobKind: { DisplayValue: '' },
        Duration: 0,
        Comment: '',
        ...initialValues,
      },
      notifyChange: () => notifier.notify(),
    }) as PerformedWorkDetailStub;
  };

  const initialItems: PerformedWorkDetailStub[] = [
    createItem(rootEntity, 0, {
      Title: 'Анализ требований',
      JobKind: { DisplayValue: 'Аналитика' },
      Duration: 60,
      Comment: 'Первичный анализ',
    }),
    createItem(rootEntity, 1, {
      Title: 'Разработка',
      JobKind: { DisplayValue: 'Разработка' },
      Duration: 120,
      Comment: 'Основная реализация',
    }),
  ];

  rootEntity.PerformedWorkDetails = createChildEntityCollectionStub({
    rootEntity,
    items: initialItems,
    createNewItem: (root, nextIndex) =>
      createItem(root, nextIndex, {
        Title: '',
        JobKind: { DisplayValue: '' },
        Duration: 0,
        Comment: '',
      }),
    notifyChange: () => notifier.notify(),
  });

  return rootEntity;
}
