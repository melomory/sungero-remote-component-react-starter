import type { IEntity } from '@directum/sungero-remote-component-types';

export interface IChildEntity<TRoot extends IEntity> extends IEntity {
  RootEntity: TRoot;
  changeProperty(propertyName: string, newValue: unknown): Promise<void>;
}

export interface IChildEntityCollection<TRoot extends IEntity, TItem extends IChildEntity<TRoot>> {
  length: number;
  addNew(): Promise<TItem>;
  remove(childEntity: TItem): Promise<void>;
  forEach(
    callback: (item: TItem, index: number, collection: IChildEntityCollection<TRoot, TItem>) => void
  ): void;
  filter(
    predicate: (
      item: TItem,
      index: number,
      collection: IChildEntityCollection<TRoot, TItem>
    ) => boolean
  ): Array<TItem>;
  find(
    predicate: (
      item: TItem,
      index: number,
      collection: IChildEntityCollection<TRoot, TItem>
    ) => void
  ): TItem | undefined;
  map<T>(
    callback: (item: TItem, index: number, collection: IChildEntityCollection<TRoot, TItem>) => T
  ): Array<T>;
  sort(compareFunction: (a: TItem, b: TItem) => number): Array<TItem>;
}

type CreateCollectionOptions<TRoot extends IEntity, TItem extends IChildEntity<TRoot>> = {
  rootEntity: TRoot;
  items?: TItem[];
  createNewItem: (rootEntity: TRoot, nextIndex: number) => TItem;
  notifyChange?: () => void;
};

export function createChildEntityCollectionStub<
  TRoot extends IEntity,
  TItem extends IChildEntity<TRoot>,
>({
  rootEntity,
  items = [],
  createNewItem,
  notifyChange,
}: CreateCollectionOptions<TRoot, TItem>): IChildEntityCollection<TRoot, TItem> {
  const collectionItems = [...items];

  const collection: IChildEntityCollection<TRoot, TItem> = {
    get length() {
      return collectionItems.length;
    },

    async addNew(): Promise<TItem> {
      const item = createNewItem(rootEntity, collectionItems.length);
      collectionItems.push(item);
      console.log(collectionItems);
      notifyChange?.();
      return item;
    },

    async remove(childEntity: TItem): Promise<void> {
      const index = collectionItems.indexOf(childEntity);
      if (index >= 0) {
        collectionItems.splice(index, 1);
        notifyChange?.();
      }
    },

    forEach(callback) {
      collectionItems.forEach((item, index) => {
        callback(item, index, collection);
      });
    },

    filter(predicate) {
      return collectionItems.filter((item, index) => predicate(item, index, collection));
    },

    find(predicate) {
      return collectionItems.find((item, index) => predicate(item, index, collection));
    },

    map<T>(
      callback: (item: TItem, index: number, collection: IChildEntityCollection<TRoot, TItem>) => T
    ): Array<T> {
      return collectionItems.map((item, index) => callback(item, index, collection));
    },

    sort(compareFunction) {
      return [...collectionItems].sort(compareFunction);
    },
  };

  return collection;
}
