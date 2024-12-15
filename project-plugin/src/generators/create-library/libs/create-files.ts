import {
  Tree,
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
} from '@nx/devkit';
import { getRootTsConfigFileName } from '@nx/js';

import type { NormalizedSchema } from './normalized-schema';
import { AngularProjectConfiguration } from '@nx/angular/src/utils/types';


export function createFiles(
  tree: Tree,
  options: NormalizedSchema,
  project: AngularProjectConfiguration
) {
  const rootOffset = offsetFromRoot(options.libraryOptions.projectRoot);
  const libNames = names(options.libraryOptions.fileName);
  const pathToComponent = options.componentOptions.flat
    ? options.libraryOptions.fileName
    : joinPathFragments(
        options.libraryOptions.fileName,
        options.libraryOptions.fileName
      );

  const substitutions = {
    libName: options.libraryOptions.name,
    libFileName: options.libraryOptions.fileName,
    libClassName: libNames.className,
    libPropertyName: libNames.propertyName,
    unitTesting: 'none',
    rootTsConfig: joinPathFragments(rootOffset, getRootTsConfigFileName(tree)),
    skipModule: options.libraryOptions.skipModule,
    projectRoot: options.libraryOptions.projectRoot,
    routing: options.libraryOptions.routing,
    pathToComponent,
    importPath: options.libraryOptions.importPath,
    rootOffset,
    angularPeerDepVersion: `latest`,
    disableModernClassFieldsBehavior: false,
    tpl: '',
  };

  console.log(substitutions)

  generateFiles(
    tree,
    joinPathFragments(__dirname, '../files/base'),
    options.libraryOptions.projectRoot,
    substitutions
  );

  if (options.libraryOptions.standalone) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/standalone-components'),
      options.libraryOptions.projectRoot,
      substitutions
    );
  } else {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/ng-module'),
      options.libraryOptions.projectRoot,
      substitutions
    );

    if (options.libraryOptions.skipModule) {
      tree.delete(
        joinPathFragments(
          project.sourceRoot,
          `lib/${options.libraryOptions.fileName}.module.ts`
        )
      );
    }
  }

  if (!options.libraryOptions.routing) {
    tree.delete(joinPathFragments(project.sourceRoot, `lib/lib.routes.ts`));
  }

  if (
    !options.libraryOptions.buildable &&
    !options.libraryOptions.publishable
  ) {
    tree.delete(joinPathFragments(project.root, `tsconfig.lib.prod.json`));
    tree.delete(joinPathFragments(project.root, `ng-package.json`));
    tree.delete(joinPathFragments(project.root, `package.json`));
  }
}
