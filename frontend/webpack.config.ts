import path from 'path';
import { IBuildEnv, IBuildPaths } from './config/build/interfaces/config';
import { buildWebpackConfig } from './config/build/buildWebpackConfig';

export default (env: IBuildEnv) => {
    const paths: IBuildPaths = {
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        build: path.resolve(__dirname, 'build'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        src: path.resolve(__dirname, 'src'),
    };

    const mode = env.mode || 'development';
    const port = env.port || 3000;

    const isDev = mode === 'development';

    return buildWebpackConfig({
        mode,
        paths,
        isDev,
        port,
    });
};
