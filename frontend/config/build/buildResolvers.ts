import {IBuildOptions} from "./interfaces/config";
import {ResolveOptions} from "webpack";

export function buildResolvers(options: IBuildOptions): ResolveOptions {
    return {
        extensions: ['.tsx', '.ts', '.js'],
        preferAbsolute: true,
        modules: [options.paths.src, 'node_modules'],
        mainFields: ['index'],
        alias: {}
    }
}
