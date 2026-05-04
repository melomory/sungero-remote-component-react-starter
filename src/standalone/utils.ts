// import componentManifestRuntime from '@/generated/component-metadata.generated';
// import type { SandboxControlEntry } from './control-registry';

// export function getControlScope(sandboxControl: SandboxControlEntry | undefined) {
//   if (!sandboxControl) return '';

//   for (const control of componentManifestRuntime.controls) {
//     for (const loader of control.loaders) {
//       if (loader.name === sandboxControl.loaderName) {
//         return loader.scope ?? '';
//       }
//     }
//   }

//   return '';
// }

// // export function getControlName(sandboxControl: SandboxControlEntry | undefined) {
// //   if (!sandboxControl) return '';

// //   for (const control of componentManifestRuntime.controls) {
// //     for (const loader of control.loaders) {
// //       if (loader.name === sandboxControl.loaderName) {
// //         return loader.scope ?? '';
// //       }
// //     }
// //   }

// //   return '';
// // }
