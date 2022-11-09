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
        return this.getValue('ROLE_SERVICE_PORT', true)
    }

    public isProduction() {
        const mode = this.getValue('ROLE_MODE', false)
        return mode != 'DEV';
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.getValue('ROLE_POSTGRES_HOST'),
            port: parseInt(this.getValue('ROLE_PORTGRES_PORT')),
            username: this.getValue('ROLE_PORTGRES_USER'),
            password: this.getValue('ROLE_PORTGRES_PASSWORD'),
            database: this.getValue('ROLE_PORTGRES_DATABASE'),
            entities: ['**/*.entity{.ts,.js}'],
            migrations: ['src/migration/*.ts'],
            migrationsTableName: "role",
            ssl: this.isProduction(),
        }
    }
}


const dbConfigService = new DbConfigService(process.env)
    .ensureValues([
        'ROLE_POSTGRES_HOST',
        'ROLE_PORTGRES_PORT',
        'ROLE_PORTGRES_USER',
        'ROLE_PORTGRES_PASSWORD',
        'ROLE_PORTGRES_DATABASE',
        ]

    )


export { dbConfigService };
