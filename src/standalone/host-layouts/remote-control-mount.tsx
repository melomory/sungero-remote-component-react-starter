import type { RefObject } from 'react';
import { type ControlScope, ControlScopes } from '@/shared/types/control-scope';

type Props = {
  controlScope: ControlScope | null;
  containerRef: RefObject<HTMLDivElement>;
  hostMountClassName?: string;
  height?: number;
  stretchVertically?: boolean;
};

export function RemoteControlMount({
  controlScope,
  containerRef,
  hostMountClassName,
  height = 500,
  stretchVertically = false,
}: Props) {
  const isCardScope = controlScope === ControlScopes.Card;

  const containerStyle = isCardScope
    ? {
        height: `${height}px`,
        minHeight: `${height}px`,
        maxHeight: `${height}px`,
      }
    : undefined;

  const viewportStyle =
    stretchVertically || !isCardScope
      ? {
          maxHeight: '100%',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          margin: 0,
        }
      : {
          maxHeight: `${height}px`,
          height: `${height}px`,
          minHeight: `${height}px`,
          width: '100%',
          overflow: 'hidden',
          margin: 0,
        };

  const innerStyle = {
    height: '100%',
    maxHeight: '100%',
  };

  return (
    <div
      className={`remote-control remote-control__container ${hostMountClassName ?? ''} ${isCardScope ? '' : 'cover__remote-control'}`}
      style={stretchVertically ? undefined : containerStyle}
    >
      <div style={viewportStyle}>
        <div style={innerStyle} ref={containerRef}></div>
      </div>
    </div>
  );
}
