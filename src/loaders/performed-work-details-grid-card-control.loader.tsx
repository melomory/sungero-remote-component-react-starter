import type {
  ILoaderArgs,
  IRemoteComponentCardApi,
} from '@directum/sungero-remote-component-types';
import PerformedWorkDetailsGrid from '@/controls/performed-work-details-grid-control/control';
import { getControlMetadata } from '@/shared/config/remote-component-metadata';
import { createReactControlLoader } from './create-react-control.loader';

export const loaderName = `performed-work-details-grid-control-card-loader`;
export const controlMetadata = getControlMetadata('PerformedWorkDetailsGridControl');

function isRemoteComponentCardApi(api: unknown): api is IRemoteComponentCardApi {
  return !!api && typeof api === 'object' && 'getEntity' in api;
}

export const createLoader = createReactControlLoader((args: ILoaderArgs) => {
  if (!isRemoteComponentCardApi(args.api)) {
    throw new Error(`${controlMetadata?.Name} requires IRemoteComponentCardApi`);
  }

  return <PerformedWorkDetailsGrid initialContext={args.initialContext} api={args.api} />;
});
