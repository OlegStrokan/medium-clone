export enum UserLogsEnum {
    USER_INITIATED = 'Get user process initiated',
    USER_RETRIEVED_SUCCESS = 'User retrieved success',
    USER_NOT_FOUND = 'User not found',
    USER_RETRIEVING_ERROR = 'Error retrieved user',

    USERS_INITIATED = 'Get users process initiated',
    USERS_RETRIEVED_SUCCESS = 'Users retrieved success',
    USERS_RETRIEVING_ERROR = 'Error retrieved users',

    USER_CREATE_INITIATED = 'User create initiated',
    USER_CREATED_SUCCESS = 'User created successfully',
    USER_CREATED_CONFLICT = 'User created conflict',
    USER_CREATED_ERROR = 'User created failed',

    USER_UPDATE_INITIATED = 'User update initiated',
    USER_UPDATED_SUCCESS = 'User updated successfully',
    USER_UPDATED_NOT_FOUND = 'User updated not found',
    USER_UPDATED_FAILED = 'User updated failed',

    USER_DELETED_INITIATED = 'User delete initiated',
    USER_DELETED_SUCCESS = 'User deleted successfully',
    USER_DELETED_NOT_FOUND = 'User deleted not found',
    USER_DELETED_ERROR = 'User deleted failed',

    USER_SUBSCRIPTION_ASSIGNMENT_INITIATED = 'Subscription assignment initiated',
    USER_SUBSCRIPTION_ASSIGNMENT_SUCCESS = 'Subscription assignment successful',
    USER_SUBSCRIPTION_ASSIGNMENT_ERROR = 'Subscription assignment error',

}
