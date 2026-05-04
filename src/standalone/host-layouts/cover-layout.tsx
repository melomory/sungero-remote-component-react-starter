import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function CoverLayout({ children }: Props) {
  return (
    <div className="cover__content cover__background cover__background_notile cover__background_none">
      <div style={{ flexBasis: '100%' }}>{children}</div>
    </div>
  );
}
