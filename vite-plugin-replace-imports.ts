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
            .map((name: string) => `const ${name} = new Proxy(function(){}, {
              apply(_t, _thisArg, args) {
                if ('${name}' === 'defineStore') {
                  let storeFn;
                  return new Proxy(function(){}, {
                    apply(_t2, _thisArg2, args2) {
                      if (!storeFn) storeFn = ${globalAccess}.${name}.apply(_thisArg, args);
                      return storeFn.apply(_thisArg2, args2);
                    },
                    get(_t2, prop2) {
                      if (!storeFn) storeFn = ${globalAccess}.${name}.apply(_thisArg, args);
                      return storeFn[prop2];
                    }
                  });
                }
                return ${globalAccess}.${name}.apply(_thisArg, args);
              },
              get(_t, prop) {
                return ${globalAccess}.${name}[prop];
              }
            });`)
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
