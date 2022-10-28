import {JwtModuleOptions, JwtOptionsFactory} from "@nestjs/jwt";

export class JwtConfigService implements JwtOptionsFactory {
    createJwtOptions(): JwtModuleOptions {
        return {
            secret: process.env.PRIVATE_ENT || "SECRET",
            signOptions: {
                expiresIn: "1h"
            }
        }
    }
}
