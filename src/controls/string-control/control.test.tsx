import '@testing-library/jest-dom';
import {
  type IRemoteComponentCardApi,
  type IRemoteComponentContext,
  type IRemoteControlInfo,
  Theme,
} from '@directum/sungero-remote-component-types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import StringControl from './control';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

const mockEntity = {
  LockInfo: {
    IsLocked: false,
    IsLockedByMe: false,
    IsLockedHere: false,
  },
  State: {
    IsEnabled: true,
  },
  Info: {
    properties: [
      {
        name: 'testProperty',
        type: 'string',
        displayValue: 'Test Property',
      },
    ],
  },
  testProperty: 'initial value',
  changeProperty: jest.fn(),
};

const mockApi = {
  executeAction: jest.fn(),
  canExecuteAction: jest.fn(),
  getEntity: jest.fn(() => mockEntity),
} as unknown as IRemoteComponentCardApi;

const mockLogger = {
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

const mockInitialContext = {
  userId: 123,
  currentCulture: 'en-US',
  theme: Theme.Default,
  clientId: 'test-client',
  tenant: 'test-tenant',
  moduleLicenses: [],
  logger: mockLogger,
} as unknown as IRemoteComponentContext;

const mockControlInfo = {
  propertyName: 'testProperty',
} as IRemoteControlInfo;

describe('StringControl', () => {
  it('renders with display value property from API', () => {
    render(
      <StringControl
        api={mockApi}
        initialContext={mockInitialContext}
        controlInfo={mockControlInfo}
      />
    );

    expect(screen.getByText('☀ Test Property')).toBeInTheDocument();
  });

  it('calls changeProperty API on input change', async () => {
    render(
      <StringControl
        api={mockApi}
        initialContext={mockInitialContext}
        controlInfo={mockControlInfo}
      />
    );

    const input = await screen.findByDisplayValue('initial value');
    fireEvent.change(input, { target: { value: 'new value' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockEntity.changeProperty).toHaveBeenCalledWith('testProperty', 'new value');
    });
  });
});
