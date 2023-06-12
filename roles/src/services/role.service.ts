import {Inject, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {IRole} from "../interfaces/IRole";

@Injectable()
export class RoleService {
    constructor(
        @Inject()
        private readonly roleRepository: Repository<IRole>
    ) {
    }
    createRole () {

    }

    getRoleByValue () {

    }

    getRoles () {

    }
}
