declare module 'react-data-grid' {
  import type { ReactNode, ReactElement, RefAttributes, Key } from 'react';

  export interface Column<TRow, TSummaryRow = unknown> {
    readonly name: string | ReactElement;
    readonly key: string;
    readonly width?: number | string | null;
    readonly minWidth?: number | null;
    readonly maxWidth?: number | null;
    readonly cellClass?: string | ((row: TRow) => string | null | undefined) | null;
    readonly headerCellClass?: string | null;
    readonly summaryCellClass?: string | ((row: TSummaryRow) => string | null | undefined) | null;
    readonly editable?: boolean | ((row: TRow) => boolean) | null;
    readonly frozen?: boolean | null;
    readonly resizable?: boolean | null;
    readonly sortable?: boolean | null;
    readonly formatter?: ((props: FormatterProps<TRow, TSummaryRow>) => ReactNode) | null;
    readonly summaryFormatter?:
      | ((props: SummaryFormatterProps<TSummaryRow, TRow>) => ReactNode)
      | null;
    readonly editor?: ((props: EditorProps<TRow, TSummaryRow>) => ReactNode) | null;
  }

  export interface CalculatedColumn<TRow, TSummaryRow = unknown> extends Column<TRow, TSummaryRow> {
    readonly idx: number;
  }

  export interface FormatterProps<TRow, TSummaryRow = unknown> {
    column: CalculatedColumn<TRow, TSummaryRow>;
    row: TRow;
    isCellSelected: boolean;
    onRowChange: (row: TRow) => void;
  }

  export interface SummaryFormatterProps<TSummaryRow, TRow = unknown> {
    column: CalculatedColumn<TRow, TSummaryRow>;
    row: TSummaryRow;
    isCellSelected: boolean;
  }

  export interface EditorProps<TRow, TSummaryRow = unknown> {
    column: CalculatedColumn<TRow, TSummaryRow>;
    row: TRow;
    onRowChange: (row: TRow, commitChanges?: boolean) => void;
    onClose: (commitChanges?: boolean) => void;
  }

  export interface RowsChangeData<R, SR = unknown> {
    indexes: number[];
    column: CalculatedColumn<R, SR>;
  }

  export interface DataGridProps<R, SR = unknown, K extends Key = Key> {
    columns: readonly Column<R, SR>[];
    rows: readonly R[];
    topSummaryRows?: readonly SR[] | null;
    bottomSummaryRows?: readonly SR[] | null;
    rowKeyGetter?: ((row: R) => K) | null;
    onRowsChange?: ((rows: R[], data: RowsChangeData<R, SR>) => void) | null;
    className?: string;
  }

  export function textEditor<TRow, TSummaryRow>(props: EditorProps<TRow, TSummaryRow>): JSX.Element;

  export function valueFormatter<TRow, TSummaryRow>(
    props: FormatterProps<TRow, TSummaryRow>
  ): JSX.Element | null;

  const DataGrid: <R, SR = unknown, K extends Key = Key>(
    props: DataGridProps<R, SR, K> & RefAttributes<HTMLDivElement>
  ) => JSX.Element;

  export default DataGrid;
}
