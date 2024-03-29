export enum RoleLogsEnum {
    CREATE_ROLE_SUCCESS = 'Role created successfully',
    CREATE_ROLE_INITIATED = 'Role creation initiated',
    CREATE_ROLE_ERROR = 'Failed to create role',
    CREATE_ROLE_CONFLICT = 'Role already exists',
    ROLE_NOT_FOUND = 'Role not found, creating a new one',
    ROLE_SEARCH_OK = 'Role retrieval successful',
    ROLE_SEARCH_INITIATED = 'Role retrieval initiated',
    ROLE_SEARCH_ERROR = 'Failed to retrieve roles',
    ROLES_SEARCH_OK = 'Roles retrieval successful',
    ROLES_SEARCH_INITIATED = 'Roles retrieval initiated',
    ROLES_SEARCH_ERROR = 'Failed to retrieve roles',
    ROLE_ASSIGNMENT_INITIATED = 'Role assignment initiated',
    ROLE_ASSIGNMENT_SUCCESS = 'Role assignment successful',
    ROLE_ASSIGNMENT_ERROR = 'Role assignment error',
    ROLE_RETRIEVAL_INITIATED = 'Role retrieval initiated',
    ROLE_RETRIEVAL_SUCCESS = 'Role retrieval successful',
    ROLE_RETRIEVAL_NOT_FOUND = 'Role not found for user ',
    ROLE_RETRIEVAL_ERROR = 'Role retrieval error',
}
