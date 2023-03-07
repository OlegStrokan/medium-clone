

export class ConfigService {
    private readonly envConfig: { [key: string]: any } = null

    constructor() {
        this.envConfig = {
            port: process.env.TOKEN_SERVICE_PORT
        };
        this.envConfig.baseUri = process.env.BASE_URI;
        this.envConfig.gatewayPort = process.env.API_GATEWAY_PORT
    }

    get(key: string): any {
        return this.envConfig[key]
    }
}
