export default {
  vendorName: 'RosA',
  componentName: 'ComponentExample',
  componentVersion: '1.0.0',
  controls: [
    {
      name: 'GanttControl',
      // Загрузчики контрола. Загрузчик - это функция, принимающая информацию о контексте и точку доступа к API.
      // Задача загрузчика - смонтировать корневой UI-компонент контрола в указанный DOM-элемент.
      // Один и тот же контрол может отображаться в разных контекстах (карточка и обложка модуля). Если контрол должен отображаться и в карточке и в обложке,
      // то для него следует создать разные загрузчики для этих контекстов (*-cover-loader и *-card-loader).
      loaders: [
        {
          // Имя загручика должно соответствовать имени загрузчика в файле component.loaders.ts.
          name: 'gantt-control-cover-loader',
          // Контекст для которого предназначен загрузчик — 'Card', 'Cover'.
          scope: 'Cover',
        },
      ],
      displayNames: [
        { locale: 'en', name: 'Gantt diagram' },
        { locale: 'ru', name: 'Диаграмма Ганта' },
      ],
    },
    {
      name: 'StringControl',
      loaders: [
        {
          name: 'string-control-card-loader',
          scope: 'Card',
        },
      ],
      displayNames: [
        { locale: 'en', name: 'String property editor' },
        { locale: 'ru', name: 'Редактор строкового свойства' },
      ],
    },
    {
      name: 'PerformedWorkDetailsGridControl',
      loaders: [
        {
          name: 'performed-work-details-grid-control-card-loader',
          scope: 'Card',
        },
      ],
      displayNames: [
        { locale: 'en', name: 'Performed work details' },
        { locale: 'ru', name: 'Список выполненных работ' },
      ],
    },
    {
      name: 'ActionsPanelControl',
      loaders: [
        {
          name: 'actions-panel-control-cover-loader',
          scope: 'Cover',
        },
      ],
      displayNames: [
        { locale: 'en', name: 'Actions panel' },
        { locale: 'ru', name: 'Панель действий' },
      ],
    },
  ],
};
