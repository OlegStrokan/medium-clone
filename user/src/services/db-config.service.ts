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
        return this.getValue('USER_SERVICE_PORT', true)
    }

    public isProduction() {
        const mode = this.getValue('USER_MODE', false)
        return mode != 'DEV';
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.getValue('USER_POSTGRES_HOST'),
            port: parseInt(this.getValue('USER_PORTGRES_PORT')),
            username: this.getValue('USER_PORTGRES_USER'),
            password: this.getValue('USER_PORTGRES_PASSWORD'),
            database: this.getValue('USER_PORTGRES_DATABASE'),
            entities: ['**/*.entity{.ts,.js}'],
            migrations: ['src/migration/*.ts'],
            migrationsTableName: "user",
            ssl: this.isProduction()
        }
    }
}


const dbConfigService = new DbConfigService(process.env)
    .ensureValues([
        'USER_POSTGRES_HOST',
        'USER_PORTGRES_PORT',
        'USER_PORTGRES_USER',
        'USER_PORTGRES_PASSWORD',
        'USER_PORTGRES_DATABASE',
        ]

    )


export { dbConfigService };
