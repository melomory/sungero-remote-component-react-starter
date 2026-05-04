import {
  type ILogger,
  type IRemoteComponentContext,
  Theme,
} from '@directum/sungero-remote-component-types';

export function createHostContextStub(
  currentCulture: string = 'ru',
  theme: Theme = Theme.Default
): IRemoteComponentContext {
  return {
    userId: 1,
    currentCulture,
    tenant: null,
    theme: theme,
    clientId: '',
    logger: {
      error(
        errorOrmessageTemplate: Error | string,
        messageTemplateOrArgs?: string | string[],
        ...args: string[]
      ) {
        console.error(errorOrmessageTemplate, messageTemplateOrArgs, args);
      },
      warning(messageTemplate: string, ...args: string[]) {
        console.warn(messageTemplate, args);
      },
      info(messageTemplate: string, ...args: string[]) {
        console.log(messageTemplate, args);
      },
      debug(messageTemplate: string, ...args: string[]) {
        console.log(messageTemplate, args);
      },
    } as unknown as ILogger,
    moduleLicenses: [
      { name: 'module1', version: '1.0' },
      { name: 'module2', version: '1.0' },
    ],
  };
}
