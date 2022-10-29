[v 0.7.0]


# This is clone of [medium](https://medium.com) with own additional features

## Tech Stack

### Backend:
- Nest.js + .NET for developing all services
- TypeORM - Orm for database interaction
- PostgreSQL - Database
- RabbitMQ - Message broker
- Swagger - for specification API

### Frontend:

- --Method not implemented--

## Brief architecture overview
This API showcase consists of the following parts:
- API gateway - 
- Token service - responsible for creating, decoding, destroying JWT tokens for users
- User service - responsible for CRUD operations on users
- Mailer service - responsible for sending out emails (confirm sign up)
- Permission service - responsible for verifying permissions for logged in users.
- Posts service - responsible for CRUD operations on users posts records
- Roles service - responsible for CRUD operations with roles records
- Frontend - frontend application
