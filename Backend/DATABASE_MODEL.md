# Database Conceptual Model

## Tables Structure

### Users
- **id** (PK) - UUID
- **username** - VARCHAR
- **email** - VARCHAR
- **password** - VARCHAR(encrypted)
- **enabled** - BOOLEAN
- **created_at** - TIMESTAMP

### Roles
- **id** (PK) - UUID
- **name** - VARCHAR (ENUM: ROLE_USER, ROLE_ADMIN, ROLE_MODERATOR)

### User_Roles (Junction Table)
- **user_id** (PK, FK) - UUID -> Users.id
- **role_id** (PK, FK) - UUID -> Roles.id

### Cars
- **id** (PK) - UUID
- **user_id** (FK) - UUID -> Users.id
- **make** - VARCHAR
- **model** - VARCHAR
- **year** - INTEGER
- **description** - TEXT
- **created_at** - TIMESTAMP

### Car_Photos
- **id** (PK) - UUID
- **car_id** (FK) - UUID -> Cars.id
- **photo_url** - VARCHAR
- **created_at** - TIMESTAMP

### Tuning_Requests
- **id** (PK) - UUID
- **user_id** (FK) - UUID -> Users.id
- **car_id** (FK) - UUID -> Cars.id
- **status** - VARCHAR
- **description** - TEXT
- **created_at** - TIMESTAMP

### Forum_Posts
- **id** (PK) - UUID
- **user_id** (FK) - UUID -> Users.id
- **title** - VARCHAR
- **content** - TEXT
- **created_at** - TIMESTAMP

### Forum_Post_Photos
- **id** (PK) - UUID
- **post_id** (FK) - UUID -> Forum_Posts.id
- **photo_url** - VARCHAR
- **created_at** - TIMESTAMP

### Forum_Comments
- **id** (PK) - UUID
- **post_id** (FK) - UUID -> Forum_Posts.id
- **user_id** (FK) - UUID -> Users.id
- **content** - TEXT
- **created_at** - TIMESTAMP

### Forum_Likes
- **id** (PK) - UUID
- **post_id** (FK) - UUID -> Forum_Posts.id
- **user_id** (FK) - UUID -> Users.id
- **created_at** - TIMESTAMP

### Chat_Messages
- **id** (PK) - UUID
- **sender_id** (FK) - UUID -> Users.id
- **receiver_id** (FK) - UUID -> Users.id
- **content** - TEXT
- **created_at** - TIMESTAMP

### Refresh_Tokens
- **id** (PK) - UUID
- **user_id** (FK) - UUID -> Users.id
- **token** - VARCHAR
- **expiry_date** - TIMESTAMP

## Relationships

1. **Users - Roles**: Many-to-Many (through User_Roles)
2. **Users - Cars**: One-to-Many (a user can have multiple cars)
3. **Cars - Car_Photos**: One-to-Many (a car can have multiple photos)
4. **Users - Tuning_Requests**: One-to-Many (a user can make multiple tuning requests)
5. **Cars - Tuning_Requests**: One-to-Many (a car can have multiple tuning requests)
6. **Users - Forum_Posts**: One-to-Many (a user can create multiple forum posts)
7. **Forum_Posts - Forum_Comments**: One-to-Many (a post can have multiple comments)
8. **Forum_Posts - Forum_Post_Photos**: One-to-Many (a post can have multiple photos)
9. **Forum_Posts - Forum_Likes**: One-to-Many (a post can have multiple likes)
10. **Users - Chat_Messages**: One-to-Many (as both sender and receiver)
11. **Users - Refresh_Tokens**: One-to-Many (a user can have multiple refresh tokens)

## Notes
- All tables use UUID as primary keys for better security and distribution
- Timestamps are used to track creation time for most entities
- The database implements soft delete where applicable (enabled flag for users)
- Foreign keys are used to maintain referential integrity
- The schema supports file management through URL references for photos

## Security Features
- Passwords are stored encrypted
- Token-based authentication using refresh tokens
- Role-based access control
