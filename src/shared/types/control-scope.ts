export const ControlScopes = {
  Card: 'Card',
  Cover: 'Cover',
} as const;

export type ControlScope = (typeof ControlScopes)[keyof typeof ControlScopes];
