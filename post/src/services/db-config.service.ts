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
        return this.getValue('POST_SERVICE_PORT', true)
    }

    public isProduction() {
        const mode = this.getValue('POST_MODE', false)
        return mode != 'DEV';
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.getValue('POST_POSTGRES_HOST'),
            port: parseInt(this.getValue('POST_PORTGRES_PORT')),
            username: this.getValue('POST_PORTGRES_USER'),
            password: this.getValue('POST_PORTGRES_PASSWORD'),
            database: this.getValue('POST_PORTGRES_DATABASE'),
            entities: ['**/*.entity{.ts,.js}'],
            migrations: ['src/migration/*.ts'],
            migrationsTableName: "post",
            ssl: this.isProduction(),
        }
    }
}


const dbConfigService = new DbConfigService(process.env)
    .ensureValues([
        'POST_POSTGRES_HOST',
        'POST_PORTGRES_PORT',
        'POST_PORTGRES_USER',
        'POST_PORTGRES_PASSWORD',
        'POST_PORTGRES_DATABASE',
        ]

    )


export { dbConfigService };
