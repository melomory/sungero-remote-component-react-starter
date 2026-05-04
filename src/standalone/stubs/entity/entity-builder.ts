import type {
  IEntity,
  IEntityInfo,
  IEntityPropertyInfo,
  ILockInfo,
  IRemoteComponentContext,
} from '@directum/sungero-remote-component-types';

export type EntityWithProperties = IEntity & {
  [property: string]: unknown;
};

type BuildOptions = {
  notifyChange?: () => void;
};

type PropertyDefinition = {
  name: string;
  type: string;
  displayValue: string;
  initialValue?: unknown;
};

function createEntityPropertyInfo(
  name: string,
  type: string,
  displayValue: string
): IEntityPropertyInfo {
  return {
    name,
    type,
    displayValue,
  };
}

function createEntityInfo(typeId: string, properties: IEntityPropertyInfo[]): IEntityInfo {
  return {
    typeId,
    properties,
  };
}

function createLockInfo(): ILockInfo {
  return {
    IsLocked: false,
    IsLockedByMe: false,
    IsLockedHere: false,
    LockTime: new Date(),
    OwnerName: '',
  };
}

class EntityBuilder {
  private id = 0;
  private displayValue = '';
  private typeId = '00000000-0000-0000-0000-000000000000';
  private properties: PropertyDefinition[] = [];

  public withId(id: number): EntityBuilder {
    this.id = id;
    return this;
  }

  public withDisplayValue(displayValue: string): EntityBuilder {
    this.displayValue = displayValue;
    return this;
  }

  public withTypeId(typeId: string): EntityBuilder {
    this.typeId = typeId;
    return this;
  }

  public withProperty(
    name: string,
    type: string,
    displayValue: string,
    initialValue?: unknown
  ): EntityBuilder {
    this.properties.push({
      name,
      type,
      displayValue,
      initialValue,
    });

    return this;
  }

  public withStringProperty(name: string, displayValue: string, initialValue = ''): EntityBuilder {
    return this.withProperty(name, 'string', displayValue, initialValue);
  }

  public withCustomProperty(
    name: string,
    type: string,
    displayValue: string,
    initialValue: unknown
  ): EntityBuilder {
    return this.withProperty(name, type, displayValue, initialValue);
  }

  public build(_context: IRemoteComponentContext, options?: BuildOptions): EntityWithProperties {
    const entity = {} as EntityWithProperties;

    entity.Id = this.id;
    entity.DisplayValue = this.displayValue;
    entity.Info = createEntityInfo(
      this.typeId,
      this.properties.map((property) =>
        createEntityPropertyInfo(property.name, property.type, property.displayValue)
      )
    );
    entity.LockInfo = createLockInfo();

    entity.State = {
      Properties: [],
      IsEnabled: true,
    };

    for (const property of this.properties) {
      entity[property.name] = property.initialValue;
    }

    entity.changeProperty = async (propertyName: string, newValue: unknown) => {
      entity[propertyName] = newValue;
      options?.notifyChange?.();
    };

    return entity;
  }
}

export function createEntityBuilder(): EntityBuilder {
  return new EntityBuilder();
}
