import type {
  ControlCleanupCallback,
  ILoaderArgs,
  ILoaderArgsBase,
  IRemoteControlLoader,
} from '@directum/sungero-remote-component-types';
import type React from 'react';
import ReactDOM from 'react-dom';
import { initI18n } from '@/i18n';
import { defaultCulture } from '@/i18n/cultures';

type LoaderRender<TArgs extends ILoaderArgs = ILoaderArgs> = (args: TArgs) => React.ReactElement;

export function createReactControlLoader<TArgs extends ILoaderArgs = ILoaderArgs>(
  render: LoaderRender<TArgs>
): IRemoteControlLoader {
  return {
    default: async (args: ILoaderArgsBase): Promise<ControlCleanupCallback> => {
      const typedArgs = args as TArgs;
      const currentCulture = typedArgs.initialContext?.currentCulture ?? defaultCulture;

      await initI18n(currentCulture);

      ReactDOM.render(render(typedArgs), typedArgs.container);

      return () => {
        ReactDOM.unmountComponentAtNode(typedArgs.container);
      };
    },
  };
}
