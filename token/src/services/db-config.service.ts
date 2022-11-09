import {TypeOrmModuleOptions} from "@nestjs/typeorm";

class DbConfigService {

    constructor(private readonly env: { [key: string]: any | undefined }) {
    }

    private getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`)
        }
        return value;
    }

    public ensureValues(keys: string[]) {
        keys.forEach(k => this.getValue(k, true))
        return this;
    }

    public getPort() {
        return this.getValue('TOKEN_SERVICE_PORT', true)
    }

    public isProduction() {
        const mode = this.getValue('TOKEN_MODE', false)
        return mode != 'DEV';
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.getValue('TOKEN_POSTGRES_HOST'),
            port: parseInt(this.getValue('TOKEN_PORTGRES_PORT')),
            username: this.getValue('TOKEN_PORTGRES_USER'),
            password: this.getValue('TOKEN_PORTGRES_PASSWORD'),
            database: this.getValue('TOKEN_PORTGRES_DATABASE'),
            entities: ['**/*.entity{.ts,.js}'],
            migrations: ['src/migration/*.ts'],
            migrationsTableName: "token",
            ssl: this.isProduction()

        }
    }
}


const dbConfigService = new DbConfigService(process.env)
    .ensureValues([
        'TOKEN_POSTGRES_HOST',
        'TOKEN_PORTGRES_PORT',
        'TOKEN_PORTGRES_USER',
        'TOKEN_PORTGRES_PASSWORD',
        'TOKEN_PORTGRES_DATABASE',
        ]

    )


export { dbConfigService };
