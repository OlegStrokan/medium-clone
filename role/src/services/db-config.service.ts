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
        return this.getValue('PORT', true)
    }

    public isProduction() {
        const mode = this.getValue('MODE', false)
        return mode != 'DEV';
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.getValue('POSTGRES_HOST'),
            port: this.getValue('PORTGRES_PORT'),
            username: this.getValue('PORTGRES_USER'),
            password: this.getValue('PORTGRES_PASSWORD'),
            database: this.getValue('PORTGRES_DATABASE'),

            models: ['**/*.model{.ts,.js}'],
            migrations: ['src/migration/*.ts'],

            cli: {
                migrationDir: 'src/migration',
            },
            ssl: this.isProduction()
        }
    }
}


const dbConfigService = new DbConfigService(process.env)
    .ensureValues([
        'POSTGRES_HOST',
        'PORTGRES_PORT',
        'PORTGRES_USER',
        'PORTGRES_PASSWORD',
        'PORTGRES_DATABASE',
        ]

    )


export { dbConfigService };
