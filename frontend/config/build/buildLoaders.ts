import {IBuildOptions} from "./interfaces/config";
import webpack from "webpack";
import {buildCssLoader} from "./loaders/buildCssLoader";

export function buildLoaders({ isDev}: IBuildOptions): webpack.RuleSetRule[] {

    const svgLoader = {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
    }

    const babelLoader = {
        test: /\.(js|jsx|tsx)$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }
    }


    const typescriptLoader = {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
    }

    const fileLoader = {
        test: /\.(png|jpeg?g|gif|woff2|woff)$/i,
        use: {
            loader: 'file-loader'
        }
    }


    const cssLoader = buildCssLoader(isDev);

    return [
        fileLoader,
        svgLoader,
        babelLoader,
        typescriptLoader,
        cssLoader
    ]


}
