export enum MessageEnum {
    'USER_NOT_FOUND_EMAIL' = 'No users with this email',
    'USER_NOT_FOUND_ID' = 'No users with this id',
    'USER_CONFLICT' = 'User with this email already exist',
    'UNAUTHORIZED' = 'Incorrect email or password',
    'USER_CREATED' = 'Your account has been successfully created',
    'USER_UPDATED' = 'Your account has been successfully updated',
    'USER_DELETED' = 'Your account has been successfully deleted',
    'USER_SEARCH_OK' = 'Ok',
    'UPDATE_FORBIDDEN' = 'You can\'t update an account that does not belong to you',
    'DELETE_FORBIDDEN' = 'You can\'t delete an account that does not belong to you',
    'PRECONDITION_FAILED' = 'Precondition failed',
}
