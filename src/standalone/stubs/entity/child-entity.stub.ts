import type { IEntity } from '@directum/sungero-remote-component-types';
import type { EntityWithProperties } from './entity-builder';

export interface IChildEntity<TRoot extends IEntity> extends IEntity {
  RootEntity: TRoot;
  changeProperty(propertyName: string, newValue: unknown): Promise<void>;
}

type CreateChildEntityOptions<TRoot extends IEntity> = {
  rootEntity: TRoot;
  id: number;
  displayValue?: string;
  initialValues?: Record<string, unknown>;
  notifyChange?: () => void;
};

export function createChildEntityStub<TRoot extends IEntity>({
  rootEntity,
  id,
  displayValue = '',
  initialValues = {},
  notifyChange,
}: CreateChildEntityOptions<TRoot>): IChildEntity<TRoot> & EntityWithProperties {
  const entity = {
    Id: id,
    DisplayValue: displayValue,
    RootEntity: rootEntity,
    ...initialValues,
    async changeProperty(propertyName: string, newValue: unknown) {
      entity[propertyName] = newValue;
      notifyChange?.();
    },
  } as IChildEntity<TRoot> & EntityWithProperties;

  return entity;
}
