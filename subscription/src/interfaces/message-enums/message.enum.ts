export enum MessageEnum {
    CREATED = 'Subscription has been successfully created',
    SUBSCRIPTION_SEARCH_OK = 'Subscription has been successfully found',
    SUBSCRIPTION_DELETE_OK = 'Subscription has been successfully deleted',
    SUBSCRIPTION_NOT_FOUND = 'No subscription with this value',
    SUBSCRIPTION_CONFLICT = 'Subscription with this value already exist',
    RELATION_CONFLICT = 'You already subscribed on this type of subscription',
    RELATION_SEARCH_OK = 'Ok',
    RELATION_NOT_FOUND = 'User with this id don\'t have any subscription',
    RELATION_CREATED = 'Subscription was successfully assigned to user',
    PRECONDITION_FAILED = 'Precondition failed',
    RELATION_FORBIDDEN = 'You can\'t subscribe another account',
    DELETE_FORBIDDEN = 'You can\'t cancel subscription for another account',

}
