import type {
  ILoaderArgs,
  IRemoteComponentCardApi,
} from '@directum/sungero-remote-component-types';
import GanttControl from '@/controls/gantt-control/control';
import { getControlMetadata } from '@/shared/config/remote-component-metadata';
import { createReactControlLoader } from './create-react-control.loader';

export const loaderName = `gantt-control-cover-loader`;
export const controlMetadata = getControlMetadata('GanttControl');

function isRemoteComponentCardApi(api: unknown): api is IRemoteComponentCardApi {
  return !!api && typeof api === 'object' && 'getEntity' in api;
}

export const createLoader = createReactControlLoader((args: ILoaderArgs) => {
  if (isRemoteComponentCardApi(args.api)) {
    throw new Error(`${controlMetadata?.Name} requires IRemoteComponentCoverApi`);
  }

  return <GanttControl initialContext={args.initialContext} api={args.api} />;
});
