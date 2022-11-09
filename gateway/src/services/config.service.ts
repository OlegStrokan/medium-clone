import { Transport } from '@nestjs/microservices';

export class ConfigService {
    private readonly envConfig: { [key: string]: any } = null;

    constructor() {
        this.envConfig = {};
        this.envConfig.port = process.env.API_GATEWAY_PORT;
        this.envConfig.tokenService = {
            options: {
                port: process.env.TOKEN_SERVICE_PORT,
                host: process.env.TOKEN_SERVICE_HOST,
            },
            transport: Transport.RMQ,
        };
        this.envConfig.userService = {
            options: {
                port: process.env.USER_SERVICE_PORT,
                host: process.env.USER_SERVICE_HOST,
            },
            transport: Transport.RMQ,
        };
        this.envConfig.taskService = {
            options: {
                port: process.env.POST_SERVICE_PORT,
                host: process.env.POST_SERVICE_HOST,
            },
            transport: Transport.RMQ,
        };
        this.envConfig.taskService = {
            options: {
                port: process.env.ROLE_POSTGRES_PORT,
                host: process.env.ROLE_POSTGRES_USER,
            },
            transport: Transport.RMQ,
        };
        this.envConfig.permissionService = {
            options: {
                port: process.env.PERMISSION_SERVICE_PORT,
                host: process.env.PERMISSION_SERVICE_HOST,
            },
            transport: Transport.RMQ,
        };
    }

    get(key: string): any {
        return this.envConfig[key];
    }
}
