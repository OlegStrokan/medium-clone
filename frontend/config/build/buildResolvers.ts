import { ResolveOptions } from 'webpack';
import { IBuildOptions } from './interfaces/config';

export function buildResolvers(options: IBuildOptions): ResolveOptions {
    return {
        extensions: ['.tsx', '.ts', '.js'],
        preferAbsolute: true,
        modules: [options.paths.src, 'node_modules'],
        mainFields: ['index'],
        alias: {},
    };
}
