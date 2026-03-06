// vite-plugin-replace-imports.ts
import type { Plugin } from 'vite';

export type ReplaceOptions = Record<string, string[] | { globalName: string; symbols: string[] }>;

export function replaceNamedImportsFromGlobals(options: ReplaceOptions): Plugin {
  return {
    name: 'replace-named-imports-from-globals',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.ts') && !id.endsWith('.vue')) return;

      let transformed = code;
      let modified = false;

      for (const [moduleName, config] of Object.entries(options)) {
        let symbols: string[];
        let globalAccess = 'window';

        if (Array.isArray(config)) {
          symbols = config;
        } else {
          symbols = config.symbols;
          globalAccess = `window['${config.globalName}']`;
        }

        const importRegex = new RegExp(
          `import\\s*\\{([^}]*?)\\}\\s*from\\s*['"]${moduleName}['"];?`,
          'g'
        );

        transformed = transformed.replace(importRegex, (_, imports) => {
          const names = imports.split(',').map((s: string) => s.trim()).filter(Boolean);
          const replacements = names
            .filter((name: string) => symbols.includes(name))
            .map((name: string) => `const ${name} = ${globalAccess}.${name};`)
            .join('\n');

          modified = true;
          return replacements;
        });
      }

      if (modified) {
        return {
          code: transformed,
          map: null,
        };
      }

      return null;
    },
  };
}
