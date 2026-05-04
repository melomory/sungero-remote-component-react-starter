declare module '@directum/sungero-remote-component-metadata-plugin' {
  class SungeroRemoteComponentMetadataPlugin {
    constructor(manifest: unknown);
    getPublicName(): string;
  }

  export = SungeroRemoteComponentMetadataPlugin;
}
