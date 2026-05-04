import type {
  ILoaderArgs,
  IRemoteComponentCardApi,
} from '@directum/sungero-remote-component-types';
import StringControl from '@/controls/string-control/control';
import { getControlMetadata } from '@/shared/config/remote-component-metadata';
import { createReactControlLoader } from './create-react-control.loader';

export const loaderName = `string-control-card-loader`;
export const controlMetadata = getControlMetadata('StringControl');

function isRemoteComponentCardApi(api: unknown): api is IRemoteComponentCardApi {
  return !!api && typeof api === 'object' && 'getEntity' in api;
}

export const createLoader = createReactControlLoader((args: ILoaderArgs) => {
  if (!isRemoteComponentCardApi(args.api)) {
    throw new Error(`${controlMetadata?.Name} requires IRemoteComponentCardApi`);
  }

  return (
    <StringControl
      initialContext={args.initialContext}
      api={args.api}
      controlInfo={args.controlInfo}
    />
  );
});
