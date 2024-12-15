import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { createLibraryGenerator } from './create-library';
import { CreateLibraryGeneratorSchema } from './schema';

describe('create-library generator', () => {
  let tree: Tree;
  const options: CreateLibraryGeneratorSchema = { directory: '' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await createLibraryGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
