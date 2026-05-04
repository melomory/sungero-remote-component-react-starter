import componentManifestRuntime from '@/generated/component-metadata.generated';
import type { IComponentMetadata, IControlMetadata } from '@/shared/types/host-api.v1.extended';
import type { SandboxControlEntry } from '@/standalone/control-registry';
import type { ControlScope } from '../types/control-scope';

type RuntimeManifest = typeof componentManifestRuntime;

function createStableId(value: string): string {
  return `stub-${value}`;
}

function getLocalizedName(
  displayNames: readonly { locale: string; name: string }[] | undefined,
  culture?: string | null,
  fallbackName?: string
): string {
  if (!displayNames || displayNames.length === 0) {
    return fallbackName ?? '';
  }

  return (
    displayNames.find((item) => item.locale === culture)?.name ??
    displayNames.find((item) => item.locale === 'en')?.name ??
    fallbackName ??
    displayNames[0]?.name ??
    ''
  );
}

function mapControlMetadata(
  control: RuntimeManifest['controls'][number],
  culture?: string | null
): IControlMetadata {
  return {
    Id: createStableId(control.name),
    Name: control.name,
    DisplayName: getLocalizedName(control.displayNames, culture, control.name),
    Loaders: Object.fromEntries(control.loaders.map((loader) => [loader.scope, loader.name])),
  };
}

export function getComponentMetadata(culture?: string | null): IComponentMetadata {
  return {
    Id: createStableId(componentManifestRuntime.componentName),
    Name: componentManifestRuntime.componentName,
    PublicName: `${componentManifestRuntime.vendorName}${componentManifestRuntime.componentName}`,
    ComponentVersion: componentManifestRuntime.componentVersion,
    HostApiVersion: '1.0.0',
    Controls: componentManifestRuntime.controls.map((control) =>
      mapControlMetadata(control, culture)
    ),
  };
}

export function getControlMetadata(
  controlName: string,
  culture?: string | null
): IControlMetadata | null {
  return getComponentMetadata(culture).Controls.find((x) => x.Name === controlName) ?? null;
}

export function getControlDisplayName(controlName: string, culture?: string | null): string {
  const control = componentManifestRuntime.controls.find((item) => item.name === controlName);

  if (!control) {
    return controlName;
  }

  return getLocalizedName(control.displayNames, culture, control.name);
}

export function getComponentManifestRuntime() {
  return componentManifestRuntime;
}

export function getControlScope(sandboxControl: SandboxControlEntry | undefined) {
  if (!sandboxControl) return null;

  for (const control of componentManifestRuntime.controls) {
    for (const loader of control.loaders) {
      if (loader.name === sandboxControl.loaderName) {
        return (loader.scope as ControlScope) ?? null;
      }
    }
  }

  return null;
}
