import {Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {PostController} from "./post.controller";
import {ConfigService} from "./services/config.service";
import {SERVICE} from "./interfaces/common/enum/microservices.enum";
import {ClientProxyFactory} from "@nestjs/microservices";

@Module({
    imports: [],
    controllers: [UserController, PostController],
    providers: [
        ConfigService,
        {
            provide: SERVICE.TOKEN,
            useFactory: (configService: ConfigService) => {
                const tokenServiceOptions = configService.get('tokenService');
                return ClientProxyFactory.create(tokenServiceOptions);
            },
            inject: [ConfigService]
        }, {
            provide: SERVICE.USER,
            useFactory: (configService: ConfigService) => {
                const tokenServiceOptions = configService.get('userService');
                return ClientProxyFactory.create(tokenServiceOptions);
            },
            inject: [ConfigService]
        }, {
            provide: SERVICE.POST,
            useFactory: (configService: ConfigService) => {
                const tokenServiceOptions = configService.get('postService');
                return ClientProxyFactory.create(tokenServiceOptions);
            },
            inject: [ConfigService]
        }, {
            provide: SERVICE.PERMISSION,
            useFactory: (configService: ConfigService) => {
                const tokenServiceOptions = configService.get('permissionService');
                return ClientProxyFactory.create(tokenServiceOptions);
            },
            inject: [ConfigService]
        }, {
            provide: SERVICE.ROLE,
            useFactory: (configService: ConfigService) => {
                const tokenServiceOptions = configService.get('roleService');
                return ClientProxyFactory.create(tokenServiceOptions);
            },
            inject: [ConfigService]
        },
    ],
})
export class AppModule {
}
