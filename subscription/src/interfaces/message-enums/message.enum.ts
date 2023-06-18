export enum MessageEnum {
    CREATED = 'Subscription has been successfully created',
    SUBSCRIPTION_SEARCH_OK = 'Ok',
    SUBSCRIPTION_NOT_FOUND = 'No subscription with this value',
    CONFLICT = 'Subscription with this value already exist',
    RELATION_SEARCH_OK = 'Ok',
    RELATION_NOT_FOUND = 'User with this id don\'t have any subscription',
    RELATION_CREATED = 'Subscription was successfully assigned to user',
    PRECONDITION_FAILED = 'Precondition failed',
}
