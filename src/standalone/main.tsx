import { initI18n } from '@i18n';
import ReactDOM from 'react-dom';
import { SandboxApp } from './sandbox-app';

async function bootstrap() {
  await initI18n('ru');

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element #root not found');
  }

  ReactDOM.render(<SandboxApp />, rootElement);
}

bootstrap();
