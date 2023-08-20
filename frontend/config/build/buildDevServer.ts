import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { IBuildOptions } from './interfaces/config';

export function buildDevServer(options: IBuildOptions): DevServerConfiguration {
    return {
        port: options.port,
        open: true,
        historyApiFallback: true,
        hot: true,
    };
}
