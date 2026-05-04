import type { ReactNode } from 'react';
import type { EditorLayoutVariant } from './types';

type Props = {
  variant: EditorLayoutVariant;
  children: ReactNode;
  stretchVertically?: boolean;
};

export function CardLayout({ variant, stretchVertically = false, children }: Props) {
  const isHeaderedVertical = variant === 'headered-vertical';

  const editorClassName = isHeaderedVertical
    ? 'headered-property-editor headered-property-editor_vertical'
    : 'headered-property-editor headered-property-editor_horizontal';

  return (
    <div
      className={`${editorClassName} ${stretchVertically ? 'headered-property-editor_expandable' : ''}`}
      style={isHeaderedVertical ? undefined : { flexGrow: '100' }}
    >
      <div
        className={`headered-property-editor__content headered-property-editor__content_vertical ${stretchVertically ? 'headered-property-editor__content_expandable' : ''}`}
      >
        <div
          className={`headered-property-editor__editor ${stretchVertically ? 'headered-property-editor__editor_expandable' : ''}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
