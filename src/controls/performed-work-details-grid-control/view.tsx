/**
 * @file Presentational-компонент remote control.
 *
 * Содержит только логику отображения и не работает напрямую с host API.
 */

import { useCallback, useMemo } from 'react';
import type { Column, FormatterProps, RowsChangeData } from 'react-data-grid';
import DataGrid, { textEditor } from 'react-data-grid';
import { useTranslation } from 'react-i18next';

import type { IPerformedWork, IPerformedWorkDetails } from './types';
import './control.css';

/**
 * Свойства view-компонента.
 *
 * Содержат уже подготовленные container-компонентом данные и обработчики.
 */
interface IProps {
  entity: IPerformedWork;
}

interface IRowData {
  _entity?: IPerformedWorkDetails;
  Id?: number | string;
  Title?: string;
  JobKind?: string;
  Duration?: number;
  Comment?: string | null;
}

const CopyRowButton = ({ row }: FormatterProps<IRowData>) => {
  const handleClick = async () => {
    const oldChild = row._entity;
    if (!oldChild) {
      throw new Error('row._entity is undefined');
    }

    // Добавляем новую дочернюю сущность в коллекцию.
    const newChild = await oldChild.RootEntity.PerformedWorkDetails.addNew();

    // Изменяем свойства дочерней сущности в коллекции.
    await newChild.changeProperty('Title', oldChild.Title);
    await newChild.changeProperty('Comment', oldChild.Comment ?? '');
    await newChild.changeProperty('Duration', oldChild.Duration);
    await newChild.changeProperty('JobKind', oldChild.JobKind as unknown as object);
  };

  const { t } = useTranslation('remoteComponent');
  return (
    <button type="button" className="preformed-work-details-grid__row-button" onClick={handleClick}>
      {t('performedWorkDetailsGrid.buttons.copy')}
    </button>
  );
};

const RemoveRowButton = ({ row }: FormatterProps<IRowData>) => {
  const handleClick = () => {
    const entity = row._entity;
    if (!entity) {
      throw new Error('row._entity is undefined');
    }

    // Удаляем дочернюю сущность из коллекции.
    entity.RootEntity.PerformedWorkDetails.remove(entity);
  };

  const { t } = useTranslation();
  return (
    <button type="button" className="preformed-work-details-grid__row-button" onClick={handleClick}>
      {t('performedWorkDetailsGrid.buttons.remove')}
    </button>
  );
};

const rowKeyGetter = (row: IRowData): number => {
  return row._entity?.Id ?? -1;
};

const handleRowsChange = (rows: Array<IRowData>, info: RowsChangeData<IRowData>) => {
  const changedRow = rows[info.indexes[0]];
  let newValue = changedRow[info.column.key as keyof IRowData] ?? '';

  if (info.column.key === 'Duration') {
    newValue = Number.parseInt(String(newValue), 10);
    if (Number.isNaN(newValue)) {
      throw new Error('Incorrect value.');
    }
  }

  // Изменение свойства дочерней сущности.
  changedRow._entity?.changeProperty(info.column.key, newValue);
};

const sum = (arr: Array<number>): number => {
  return arr.reduce((partialSum, a) => partialSum + a, 0);
};

/**
 * UI-представление контрола.
 *
 * Интеграция с host API, локализация и вычисление состояния
 * остаются в container-компоненте.
 */
const ControlView = ({ entity }: IProps) => {
  const { t } = useTranslation('remoteComponent');
  const works = entity.PerformedWorkDetails;
  let workItems = entity.PerformedWorkDetails.map((w) => w);
  const durationSum = sum(works?.map((w) => w.Duration));
  const summaryRowId = t('performedWorkDetailsGrid.summary.total');
  const summaryRows = useMemo<Array<IRowData>>(
    () => [{ Id: summaryRowId, Duration: durationSum }],
    [summaryRowId, durationSum]
  );
  const handleAddEntryClick = useCallback(async () => {
    if (!works) {
      return;
    }
    // Добавляем новую дочернюю сущность в коллекцию.
    await works.addNew();
    workItems = works.map((w) => w);
  }, [works]);

  const columns: Array<Column<IRowData>> = useMemo(
    () => [
      {
        key: 'Id',
        name: t('performedWorkDetailsGrid.columns.id'),
        sortable: true,
        width: 60,
        summaryCellClass: 'preformed-work-details-grid__summary-cell',
        // summaryFormatter: valueFormatter,
      },
      {
        key: 'Title',
        name: t('performedWorkDetailsGrid.columns.title'),
        sortable: true,
        summaryCellClass: 'preformed-work-details-grid__summary-cell',
        editor: textEditor,
      },
      {
        key: 'JobKind',
        name: t('performedWorkDetailsGrid.columns.jobKind'),
        sortable: true,
        summaryCellClass: 'preformed-work-details-grid__summary-cell',
      },
      {
        key: 'Duration',
        name: t('performedWorkDetailsGrid.columns.duration'),
        sortable: true,
        summaryCellClass: 'preformed-work-details-grid__summary-cell',
        editor: textEditor,
        // summaryFormatter: valueFormatter,
      },
      {
        key: 'Comment',
        name: t('performedWorkDetailsGrid.columns.comment'),
        sortable: true,
        summaryCellClass: 'preformed-work-details-grid__summary-cell',
        editor: textEditor,
      },
      {
        key: 'CopyButton',
        name: '',
        summaryCellClass: 'preformed-work-details-grid__summary-cell',
        formatter: CopyRowButton,
        width: 104,
      },
      {
        key: 'RemoveButton',
        name: '',
        summaryCellClass: 'preformed-work-details-grid__summary-cell',
        formatter: RemoveRowButton,
        width: 91,
      },
    ],
    [t]
  );

  const data: Array<IRowData> = useMemo(
    () =>
      workItems.map((work) => ({
        _entity: work,
        Id: work.Id,
        Title: work.Title,
        JobKind: work.JobKind?.DisplayValue,
        Duration: work.Duration,
        Comment: work.Comment,
      })),
    [workItems]
  );

  return (
    <div className="preformed-work-details-grid">
      <div className="preformed-work-details-grid__top-buttons">
        <button
          type="button"
          className="preformed-work-details-grid__add-new-button"
          onClick={handleAddEntryClick}
        >
          {t('performedWorkDetailsGrid.buttons.add')}
        </button>
      </div>
      <DataGrid
        className="preformed-work-details-grid__grid"
        columns={columns}
        rows={data}
        rowKeyGetter={rowKeyGetter}
        bottomSummaryRows={summaryRows}
        onRowsChange={handleRowsChange}
      />
    </div>
  );
};

export default ControlView;
