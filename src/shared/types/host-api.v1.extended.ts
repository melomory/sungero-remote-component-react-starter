import type { Guid, IRemoteComponentCardApi } from '@directum/sungero-remote-component-types';

export interface IControlMetadata {
  Id: Guid;
  Name: string;
  DisplayName: string;
  Loaders: Record<string, string>;
}

export interface IComponentMetadata {
  Id: Guid;
  Name: string;
  PublicName: string;
  ComponentVersion: string;
  HostApiVersion: string;
  Controls: Array<IControlMetadata>;
}

export interface IActionsApi {
  getContextData: () => unknown;
  getCurrentEntity: () => unknown;
  metadataActions: IMetadataActionsApi;
}

export interface IRemoteComponentCardApiExtended extends IRemoteComponentCardApi {
  actions: IActionsApi;
  componentMetadata: IComponentMetadata;
}

export interface PropertyMetadata {
  Name: string;
  DisplayName: string;
  Length?: number;
  SearchPlaceholder?: string;
  PropertyId?: Guid;
  HasFilteringHandler?: boolean;
  IsEnabled?: boolean;
  IsDisplayValue?: boolean;
  [key: string]: unknown;
}

export interface IEntityMetadata {
  EntityType: Guid;
  Properties: Record<string, PropertyMetadata>;
}

export interface IMetadataActionsApi {
  getEntityMetadataByGuid: (guid: Guid) => IEntityMetadata;
}
