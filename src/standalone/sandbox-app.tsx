import { i18n } from '@i18n';
import {
  defaultCulture,
  getCultureLabel,
  isSupportedCulture,
  type SupportedCulture,
  supportedCultures,
} from '@i18n/cultures';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sandboxControls } from './control-registry';
import { CardLayout } from './host-layouts/card-layout';
import type { EditorLayoutVariant } from './host-layouts/types';
import { mountHostStyles, unmountHostStyles } from './host-styles';
import './host-sandbox.css';
import SungeroRemoteComponentMetadataPlugin from '@directum/sungero-remote-component-metadata-plugin';
import { Theme } from '@directum/sungero-remote-component-types';
import componentManifestRuntime from '@/generated/component-metadata.generated';
import { getControlDisplayName, getControlScope } from '@/shared/config/remote-component-metadata';
import { ControlScopes } from '@/shared/types/control-scope';
import { CoverLayout } from './host-layouts/cover-layout';
import { RemoteControlMount } from './host-layouts/remote-control-mount';

export function SandboxApp() {
  const { t } = useTranslation('sandbox');

  const [selectedControlId, setSelectedControlId] = useState(sandboxControls[0]?.id ?? '');
  const [useHostStyles, setUseHostStyles] = useState(true);
  const [theme, setTheme] = useState<Theme>(Theme.Default);
  const [culture, setCulture] = useState<SupportedCulture>(defaultCulture);
  const [layoutVariant, setLayoutVariant] = useState<EditorLayoutVariant>('headered-vertical');
  const [previewHeight, setPreviewHeight] = useState<number>(200);
  const [stretchVertically, setStretchVertically] = useState(false);

  const loaderContainerRef = useRef<HTMLDivElement | null>(null);

  const selectedControl = useMemo(
    () => sandboxControls.find((control) => control.id === selectedControlId),
    [selectedControlId]
  );

  const controlScope = useMemo(() => getControlScope(selectedControl) ?? null, [selectedControl]);

  useEffect(() => {
    void i18n.changeLanguage(culture);
  }, [culture]);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('night-theme');

    if (theme === Theme.Night) {
      root.classList.add('night-theme');
    }

    root.setAttribute('data-culture', culture);
    root.setAttribute('lang', culture);

    return () => {
      root.classList.remove('night-theme');
      root.removeAttribute('data-culture');
    };
  }, [theme, culture]);

  useEffect(() => {
    if (!useHostStyles) {
      unmountHostStyles();
      return;
    }

    return mountHostStyles();
  }, [useHostStyles]);

  useEffect(() => {
    if (
      !selectedControl?.loader ||
      !selectedControl.createLoaderArgs ||
      !loaderContainerRef.current
    ) {
      return;
    }

    let cleanup: (() => void) | undefined;
    let disposed = false;

    void selectedControl.loader
      .default(selectedControl.createLoaderArgs(loaderContainerRef.current, culture, theme))
      .then((destroy) => {
        if (disposed) {
          destroy();
          return;
        }

        cleanup = destroy;
      });

    return () => {
      disposed = true;
      if (cleanup) {
        cleanup();
      }
    };
  }, [selectedControl, culture, theme]);

  const generateMetadataPlugin = new SungeroRemoteComponentMetadataPlugin(componentManifestRuntime);
  const publicName = generateMetadataPlugin.getPublicName();
  const hostMountClassName = `remote-control__${publicName.toLowerCase()}`;

  const renderedControl = (
    <RemoteControlMount
      controlScope={controlScope}
      containerRef={loaderContainerRef}
      hostMountClassName={hostMountClassName}
      height={previewHeight}
      stretchVertically={stretchVertically}
    />
  );

  const LayoutContent =
    controlScope === ControlScopes.Card ? (
      <CardLayout variant={layoutVariant} stretchVertically={stretchVertically}>
        {renderedControl}
      </CardLayout>
    ) : (
      <CoverLayout>{renderedControl}</CoverLayout>
    );

  return (
    <div className="sandbox-page">
      <div className="sandbox-page__container">
        <header className="sandbox-header">
          <div className="sandbox-header__content">
            <div>
              <h1 className="sandbox-header__title">{t('header.title')}</h1>
              <p className="sandbox-header__subtitle">{t('header.subtitle')}</p>
            </div>

            <div className="sandbox-header__badges">
              <span
                className={`sandbox-badge ${
                  useHostStyles ? 'sandbox-badge--success' : 'sandbox-badge--muted'
                }`}
              >
                {useHostStyles ? t('badges.hostStylesOn') : t('badges.hostStylesOff')}
              </span>
            </div>
          </div>
        </header>

        <section className="sandbox-toolbar">
          <label className="sandbox-field">
            <span className="sandbox-field__label">{t('toolbar.control')}</span>
            <select
              value={selectedControlId}
              onChange={(e) => setSelectedControlId(e.target.value)}
            >
              {sandboxControls.map((control) => (
                <option key={control.id} value={control.id}>
                  {getControlDisplayName(control.name, culture)}
                </option>
              ))}
            </select>
          </label>

          <label className="sandbox-field">
            <span className="sandbox-field__label">{t('toolbar.culture')}</span>
            <select
              value={culture}
              onChange={(e) => {
                const nextCulture = e.target.value;
                if (isSupportedCulture(nextCulture)) {
                  setCulture(nextCulture);
                }
              }}
            >
              {supportedCultures.map((item) => (
                <option key={item} value={item}>
                  {getCultureLabel(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="sandbox-field">
            <span className="sandbox-field__label">{t('toolbar.theme')}</span>
            <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
              <option value={Theme.Default}>{t('theme.default')}</option>
              <option value={Theme.Night}>{t('theme.night')}</option>
            </select>
          </label>
          {controlScope === 'Card' && (
            <>
              <label className="sandbox-field">
                <span className="sandbox-field__label">{t('toolbar.editorLayout')}</span>
                <select
                  value={layoutVariant}
                  onChange={(e) => setLayoutVariant(e.target.value as EditorLayoutVariant)}
                >
                  <option value="headered-vertical">{t('layout.headeredVertical')}</option>
                  <option value="headered-horizontal">{t('layout.headeredHorizontal')}</option>
                </select>
              </label>

              <label className="sandbox-field">
                <span className="sandbox-field__label">{t('toolbar.height')}</span>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  step={10}
                  value={previewHeight}
                  onChange={(e) => {
                    const nextValue = Number(e.target.value);

                    if (!Number.isNaN(nextValue)) {
                      setPreviewHeight(nextValue);
                    }
                  }}
                  className="sandbox-field__input"
                />
              </label>

              <div className="sandbox-field">
                <span className="sandbox-field__label">{t('toolbar.stretchVertically')}</span>
                <label className="sandbox-toggle">
                  <input
                    type="checkbox"
                    checked={stretchVertically}
                    onChange={(e) => setStretchVertically(e.target.checked)}
                  />
                  <span>{stretchVertically ? t('toolbar.enabled') : t('toolbar.disabled')}</span>
                </label>
              </div>
            </>
          )}

          <div className="sandbox-field">
            <span className="sandbox-field__label">{t('toolbar.hostStyles')}</span>
            <label className="sandbox-toggle">
              <input
                type="checkbox"
                checked={useHostStyles}
                onChange={(e) => setUseHostStyles(e.target.checked)}
              />
              <span>{useHostStyles ? t('toolbar.enabled') : t('toolbar.disabled')}</span>
            </label>
          </div>
        </section>

        <div className="sandbox-layout">
          <section className="sandbox-preview-card">
            <div className="sandbox-preview-card__header">
              <div>
                <h2 className="sandbox-section-title">{t('preview.title')}</h2>
                <p className="sandbox-section-subtitle">{t('preview.subtitle')}</p>
              </div>
            </div>

            <div className="sandbox-host-shell" data-theme={theme} data-culture={culture}>
              <div className="sandbox-host-layout">{LayoutContent}</div>
            </div>
          </section>

          <aside className="sandbox-info-card">
            <h2 className="sandbox-section-title">{t('environment.title')}</h2>
            <p className="sandbox-section-subtitle">{t('environment.subtitle')}</p>

            <dl className="sandbox-meta">
              <dt>{t('environment.control')}</dt>
              <dd>{selectedControl?.name ?? '—'}</dd>

              <dt>{t('environment.controlId')}</dt>
              <dd>{selectedControl?.id ?? '—'}</dd>

              <dt>{t('environment.culture')}</dt>
              <dd>{culture}</dd>

              <dt>{t('environment.theme')}</dt>
              <dd>{theme}</dd>

              <dt>{t('environment.controlScope')}</dt>
              <dd>{controlScope}</dd>

              {controlScope === 'Card' && (
                <>
                  <dt>{t('environment.layout')}</dt>
                  <dd>{layoutVariant}</dd>
                </>
              )}

              <dt>{t('environment.hostStyles')}</dt>
              <dd>{useHostStyles ? t('environment.enabled') : t('environment.disabled')}</dd>
            </dl>
          </aside>
        </div>
      </div>
    </div>
  );
}
