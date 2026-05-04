const hostCssBasePath = '/host-assets/css/current';

const commonHostCssFiles = ['scrollbar.css', 'appStyles.css'] as const;

const themeCssFiles = {
  default: 'theme-default.css',
  night: 'theme-night.css',
} as const;

export type HostTheme = keyof typeof themeCssFiles;

function createHref(fileName: string): string {
  return `${hostCssBasePath}/${fileName}`;
}

function removeMountedHostStyles() {
  document.querySelectorAll('link[data-host-style="true"]').forEach((node) => {
    node.remove();
  });
}

function getFirstStyleLikeNode(): Element | null {
  const head = document.head;
  const nodes = head.querySelectorAll('link[rel="stylesheet"], style');

  if (nodes.length === 0) {
    return null;
  }

  return nodes[0];
}

function insertBefore(referenceNode: Element | null, newNode: Node) {
  const parent = document.head;

  if (!referenceNode) {
    parent.appendChild(newNode);
    return;
  }

  parent.insertBefore(newNode, referenceNode);
}

export function mountHostStyles() {
  removeMountedHostStyles();

  const files = [themeCssFiles.default, themeCssFiles.night, ...commonHostCssFiles];
  const links: HTMLLinkElement[] = [];

  let firstStyleNode = getFirstStyleLikeNode();

  for (const fileName of files) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = createHref(fileName);
    link.dataset.hostStyle = 'true';

    link.onerror = () => {
      console.warn(`[host-styles] Failed to load ${link.href}`);
    };

    insertBefore(firstStyleNode, link);

    if (!firstStyleNode) {
      firstStyleNode = link;
    }

    links.push(link);
  }

  return () => {
    for (const link of links) {
      link.remove();
    }
  };
}

export function unmountHostStyles() {
  removeMountedHostStyles();
}
