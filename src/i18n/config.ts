import i18next, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import enRemoteComponent from './resources/en/remote-component.json';
import enSandbox from './resources/en/sandbox.json';
import ruRemoteComponent from './resources/ru/remote-component.json';
import ruSandbox from './resources/ru/sandbox.json';

const i18n = i18next.createInstance();

let initPromise: Promise<I18nInstance> | null = null;

export const initI18n = (language?: string) => {
  if (!initPromise) {
    initPromise = i18n
      .use(initReactI18next)
      .init({
        lng: language,
        defaultNS: 'remoteComponent',
        ns: ['remoteComponent, sandbox'],
        resources: {
          ru: {
            remoteComponent: ruRemoteComponent,
            sandbox: ruSandbox,
          },
          en: {
            remoteComponent: enRemoteComponent,
            sandbox: enSandbox,
          },
        },
        fallbackLng: 'en',
        supportedLngs: ['en', 'ru', 'en-US', 'ru-RU'],
        interpolation: {
          escapeValue: false,
        },
        initImmediate: false,
        react: {
          useSuspense: false,
        },
      })
      .then(() => i18n);
  }

  return initPromise.then(async (instance) => {
    if (instance.language !== language) {
      await instance.changeLanguage(language);
    }

    return instance;
  });
};

export const changeI18nLanguage = async (language?: string) => {
  const instance = await initI18n(language);
  return instance;
};

export default i18n;
