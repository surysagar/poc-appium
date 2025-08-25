// utils/pathResolver.ts
import { join as joinPath, resolve as resolvePath } from 'path';

export class PathResolver {
  private static _instance: PathResolver;

  static get Instance() {
    if (!this._instance) {
      this._instance = new PathResolver();
    }
    return this._instance;
  }

  resolvePath(pathToAdd: string): string {
    const basePath = process.env.RESOURCE_PATH || '.';
    return resolvePath(joinPath(basePath, pathToAdd));
  }
}
