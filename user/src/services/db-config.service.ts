import {TypeOrmModuleOptions} from "@nestjs/typeorm";

class DbConfigService {

    constructor(private readonly env: { [key: string]: any | undefined }) {
    }

    private getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            console.log(`config error - missing env.${key}`, key)
        }
        return value;
    }

    public ensureValues(keys: string[]) {
        keys.forEach(k => this.getValue(k, true))
        return this;
    }

    public getPort() {
        return this.getValue('USER_SERVICE_PORT', true)
    }

    public isProduction() {
        const mode = this.getValue('USER_MODE', false)
        return mode != 'DEV';
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: 'postgres',
            port: 5433,
            username: 'user',
            password: 'password',
            database: 'user',
            entities: ['**/*.entity{.ts}'],
            migrations: ['src/migration/*.ts'],
            migrationsTableName: "user",
            ssl: false
        }
    }
}


const dbConfigService = new DbConfigService(process.env)
    .ensureValues([
        'USER_POSTGRES_HOST',
        'USER_POSTGRES_PORT',
        'USER_POSTGRES_USER',
        'USER_POSTGRES_PASSWORD',
        'USER_POSTGRES_DATABASE',
        ]

    )


export { dbConfigService };
