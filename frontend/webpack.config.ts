import {IBuildEnv, IBuildPaths} from "./config/build/interfaces/config";
import path from "path";
import webpack from 'webpack'

export default (env: IBuildEnv) => {
    const paths: IBuildPaths = {

    }

    const mode = env.mode || 'development'
    const port = env.port || 3000

    const isDev = mode === 'development'

    const config: webpack
}
