import type {
  Guid,
  IEntity,
  IRemoteComponentContext,
  IRemoteComponentCoverApi,
  IRemoteCoverActionMetadata,
} from '@directum/sungero-remote-component-types';
import { getComponentMetadata } from '@/shared/config/remote-component-metadata';
import type {
  IActionsApi,
  IComponentMetadata,
  IMetadataActionsApi,
  IRemoteComponentCardApiExtended,
} from '@/shared/types/host-api.v1.extended';

type StubEntity = IEntity & Record<string, unknown>;

export type EntityWithProperties = IEntity & {
  [property: string]: unknown;
};

function createMetadataActionsStub(): IMetadataActionsApi {
  return {} as IMetadataActionsApi;
}

/** Заглушка API для отладки в режиме standalone. */
class HostStubCardApi implements IRemoteComponentCardApiExtended {
  private entity: StubEntity;
  private context: IRemoteComponentContext;

  public actions: IActionsApi;
  public componentMetadata: IComponentMetadata;

  public onControlUpdate?: (updatedContext: IRemoteComponentContext) => void;

  public constructor(context: IRemoteComponentContext, entity: IEntity) {
    this.context = context;
    this.entity = entity as StubEntity;
    this.componentMetadata = getComponentMetadata(context.currentCulture);

    this.actions = {
      getContextData: () => ({
        context: this.context,
        componentMetadata: this.componentMetadata,
      }),

      getCurrentEntity: () => this.entity,

      metadataActions: createMetadataActionsStub(),
    };
  }

  public getSettings(): Promise<Record<string, string>> {
    throw new Error('Method not implemented.');
  }

  public executeAction(actionName: string): Promise<void> {
    console.log(`Action ${actionName} executed.`);
    return Promise.resolve();
  }

  public getActionsMetadata(): Promise<void> {
    console.log('Get Actions Metadata.');
    return Promise.resolve();
  }

  public canExecuteAction(_actionName: string): boolean {
    return true;
  }

  public getEntity<T extends IEntity>(): T {
    return this.entity as unknown as T;
  }
}

export function createHostCardApiStub(
  context: IRemoteComponentContext,
  entity: EntityWithProperties
): IRemoteComponentCardApiExtended {
  return new HostStubCardApi(context, entity);
}

class HostStubCoverApi implements IRemoteComponentCoverApi {
  private context: IRemoteComponentContext;
  public componentMetadata: IComponentMetadata;

  public onControlUpdate?: (updatedContext: IRemoteComponentContext) => void;

  public constructor(context: IRemoteComponentContext) {
    this.context = context;
    this.componentMetadata = getComponentMetadata(this.context.currentCulture);
  }

  public getSettings(): Promise<Record<string, string>> {
    throw new Error('Method not implemented.');
  }

  public executeAction(id: Guid): Promise<void> {
    console.log(`Action ${id} executed.`);
    return Promise.resolve();
  }

  public getActionsMetadata(): Array<IRemoteCoverActionMetadata> {
    console.log('Get Actions Metadata.');
    return [
      {
        id: 'eb6154bc-64ed-4ba7-a7ea-76b1aad8edf5',
        title: 'Создать документ',
        description: 'Быстрое создание документа',
      },
      {
        id: 'bfa086f0-f8a4-4e08-a6eb-ca4e6a5e4777',
        title: 'Список документов',
        description: 'Показать все документы',
      },
    ];
  }
}

export function createHostCoverApiStub(context: IRemoteComponentContext): IRemoteComponentCoverApi {
  return new HostStubCoverApi(context);
}
