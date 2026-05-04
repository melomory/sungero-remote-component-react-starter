import type {
  ILoaderArgs,
  IRemoteComponentCardApi,
  IRemoteComponentCoverApi,
} from '@directum/sungero-remote-component-types';
import ActionsPanelControl from '@/controls/actions-panel/control';
import { getControlMetadata } from '@/shared/config/remote-component-metadata';
import { createReactControlLoader } from './create-react-control.loader';

export const loaderName = `actions-panel-control-cover-loader`;
export const controlMetadata = getControlMetadata('ActionsPanelControl');

function isRemoteComponentCardApi(api: unknown): api is IRemoteComponentCardApi {
  return !!api && typeof api === 'object' && 'getEntity' in api;
}

export const createLoader = createReactControlLoader((args: ILoaderArgs) => {
  if (isRemoteComponentCardApi(args.api)) {
    throw new Error(`${controlMetadata?.Name} requires IRemoteComponentCoverApi`);
  }

  return (
    <ActionsPanelControl
      initialContext={args.initialContext}
      api={args.api as IRemoteComponentCoverApi}
    />
  );
});
