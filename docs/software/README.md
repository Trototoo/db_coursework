# Реалізація інформаційного та програмного забезпечення

В рамках проекту розробляється: 
## SQL-скрипт для створення на початкового наповнення бази даних

```SQL
-- -----------------------------------------------------
-- Table `django_migrations`- Service table (stores the history of migrations)
-- -----------------------------------------------------
create table django_migrations (
  id bigint generated by default as identity primary key, 
  app varchar(255) not null, 
  name varchar(255) not null, 
  applied timestamp with time zone not null
);

alter table 
  django_migrations owner to nikitavn;

-- -----------------------------------------------------
-- Table `django_content_type`- Service table (stores data about relationships between models)
-- -----------------------------------------------------
create table django_content_type (
  id integer generated by default as identity primary key, 
  app_label varchar(100) not null, 
  model varchar(100) not null, 
  constraint django_content_type_app_label_model_76bd3d3b_uniq unique (app_label, model)
);

alter table 
  django_content_type owner to nikitavn;
  
-- -----------------------------------------------------
-- Table `auth_permission`- Service table (stores permissions)
-- ----------------------------------------------------- 
create table auth_permission (
  id integer generated by default as identity primary key, 
  name varchar(255) not null, 
  content_type_id integer not null constraint auth_permission_content_type_id_2f476e4b_fk_django_co references django_content_type deferrable initially deferred, 
  codename varchar(100) not null, 
  constraint auth_permission_content_type_id_codename_01ab375a_uniq unique (content_type_id, codename)
);

alter table 
  auth_permission owner to nikitavn;

create index auth_permission_content_type_id_2f476e4b on auth_permission (content_type_id);

-- -----------------------------------------------------
-- Table `auth_group`- Service table (stores groups)
-- ----------------------------------------------------- 
create table auth_group (
  id integer generated by default as identity primary key, 
  name varchar(150) not null unique
);

alter table 
  auth_group owner to nikitavn;

create index auth_group_name_a6ea08ec_like on auth_group (name varchar_pattern_ops);

-- -----------------------------------------------------
-- Table `auth_group_permissions`- Service table (binding table, stores data about permissions for groups
-- ----------------------------------------------------- 
create table auth_group_permissions (
  id bigint generated by default as identity primary key, 
  group_id integer not null constraint auth_group_permissions_group_id_b120cbf9_fk_auth_group_id references auth_group deferrable initially deferred, 
  permission_id integer not null constraint auth_group_permissio_permission_id_84c5c92e_fk_auth_perm references auth_permission deferrable initially deferred, 
  constraint auth_group_permissions_group_id_permission_id_0cd325b0_uniq unique (group_id, permission_id)
);

alter table 
  auth_group_permissions owner to nikitavn;

create index auth_group_permissions_group_id_b120cbf9 on auth_group_permissions (group_id);
create index auth_group_permissions_permission_id_84c5c92e on auth_group_permissions (permission_id);

-- -----------------------------------------------------
-- Table `auth_user`- Stores information about registered users
-- ----------------------------------------------------- 
create table auth_user (
  id integer generated by default as identity primary key, 
  password varchar(128) not null, 
  last_login timestamp with time zone, 
  is_superuser boolean not null, 
  username varchar(150) not null unique, 
  first_name varchar(150) not null, 
  last_name varchar(150) not null, 
  email varchar(254) not null, 
  is_staff boolean not null, 
  is_active boolean not null, 
  date_joined timestamp with time zone not null
);

alter table 
  auth_user owner to nikitavn;

create index auth_user_username_6821ab7c_like on auth_user (username varchar_pattern_ops);

-- -----------------------------------------------------
-- Table `auth_user_groups`- Service table (binding table, associate users with groups)
-- ----------------------------------------------------- 
create table auth_user_groups (
  id bigint generated by default as identity primary key, 
  user_id integer not null constraint auth_user_groups_user_id_6a12ed8b_fk_auth_user_id references auth_user deferrable initially deferred, 
  group_id integer not null constraint auth_user_groups_group_id_97559544_fk_auth_group_id references auth_group deferrable initially deferred, 
  constraint auth_user_groups_user_id_group_id_94350c0c_uniq unique (user_id, group_id)
);

alter table 
  auth_user_groups owner to nikitavn;

create index auth_user_groups_user_id_6a12ed8b on auth_user_groups (user_id);
create index auth_user_groups_group_id_97559544 on auth_user_groups (group_id);

-- -----------------------------------------------------
-- Table `auth_user_user_permissions`- Service table (binding table, stores user permissions)
-- ----------------------------------------------------- 
create table auth_user_user_permissions (
  id bigint generated by default as identity primary key, 
  user_id integer not null constraint auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id references auth_user deferrable initially deferred, 
  permission_id integer not null constraint auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm references auth_permission deferrable initially deferred, 
  constraint auth_user_user_permissions_user_id_permission_id_14a6b632_uniq unique (user_id, permission_id)
);

alter table 
  auth_user_user_permissions owner to nikitavn;

create index auth_user_user_permissions_user_id_a95ead1b on auth_user_user_permissions (user_id);
create index auth_user_user_permissions_permission_id_1fbb5f2c on auth_user_user_permissions (permission_id);

-- -----------------------------------------------------
-- Table `django_admin_log`- Service table (stores a history of administrator actions)
-- ----------------------------------------------------- 
create table django_admin_log (
  id integer generated by default as identity primary key, 
  action_time timestamp with time zone not null, 
  object_id text, 
  object_repr varchar(200) not null, 
  action_flag smallint not null constraint django_admin_log_action_flag_check check (action_flag >= 0), 
  change_message text not null, 
  content_type_id integer constraint django_admin_log_content_type_id_c4bce8eb_fk_django_co references django_content_type deferrable initially deferred, 
  user_id integer not null constraint django_admin_log_user_id_c564eba6_fk_auth_user_id references auth_user deferrable initially deferred
);

alter table 
  django_admin_log owner to nikitavn;

create index django_admin_log_content_type_id_c4bce8eb on django_admin_log (content_type_id);
create index django_admin_log_user_id_c564eba6 on django_admin_log (user_id);

-- -----------------------------------------------------
-- Table `pdapp_category`- Stores dataset categories
-- ----------------------------------------------------- 
create table pdapp_category (
  id bigint generated by default as identity primary key, 
  name varchar(200) not null, 
  hex_code varchar(7) not null
);

alter table 
  pdapp_category owner to nikitavn;

-- -----------------------------------------------------
-- Table `pdapp_dataset`- Stores information about datasets
-- ----------------------------------------------------- 
create table pdapp_dataset (
  id bigint generated by default as identity primary key, 
  name varchar(200) not null, 
  description varchar(2000) not null, 
  category_id bigint not null constraint pdapp_dataset_category_id_02477a8e_fk_pdapp_category_id references pdapp_category deferrable initially deferred
);

alter table 
  pdapp_dataset owner to nikitavn;

create index pdapp_dataset_category_id_02477a8e on pdapp_dataset (category_id);

-- -----------------------------------------------------
-- Table `pdapp_datasetfile`- Stores information about files belonging to datasets
-- ----------------------------------------------------- 
create table pdapp_datasetfile (
  id bigint generated by default as identity primary key, 
  name varchar(200) not null, 
  description varchar(2000) not null, 
  file_csv varchar(200) not null, 
  provider varchar(200) not null, 
  date_creation timestamp with time zone not null, 
  confirmed boolean not null, 
  created_by_id integer not null constraint pdapp_datasetfile_created_by_id_89a2d270_fk_auth_user_id references auth_user deferrable initially deferred, 
  dataset_id bigint not null constraint pdapp_datasetfile_dataset_id_7773aff1_fk_pdapp_dataset_id references pdapp_dataset deferrable initially deferred
);

alter table 
  pdapp_datasetfile owner to nikitavn;

create index pdapp_datasetfile_created_by_id_89a2d270 on pdapp_datasetfile (created_by_id);
create index pdapp_datasetfile_dataset_id_7773aff1 on pdapp_datasetfile (dataset_id);

-- -----------------------------------------------------
-- Table `django_session`- Service table (stores session data)
-- ----------------------------------------------------- 
create table django_session (
  session_key varchar(40) not null primary key, 
  session_data text not null, 
  expire_date timestamp with time zone not null
);

alter table 
  django_session owner to nikitavn;

create index django_session_session_key_c0390e0f_like on django_session (session_key varchar_pattern_ops);
create index django_session_expire_date_a5c62663 on django_session (expire_date);
```

# RESTfull сервіс для управління даними

## Файл підключення до бази даних

```js
const Pool = require('pg').Pool;
const pool = new Pool({
    user: "postgres",
    password: "database",
    host: "localhost",
    port: 5000,
    database: "node_postgres"
});

module.exports = pool;
```
## Файл з роутером
```js
const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController.js');

router.post('/user', userController.createUser);
router.get('/user', userController.getUsers);
router.get('/user/:id', userController.getOneUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

module.exports = router;
```
## Файл контролерів для обробки запитів
```js
const db = require('../config/db.js');

class UserController {
    async createUser(req, res) {
        let { username, email, password, is_superuser, is_staff, first_name, last_name } = req.body;

        // Check that required fields were provided
        if (!(username && email && password && first_name && last_name)) {
            return res.status(400).json({ message: "Username, email, password, first name and last name must be specified" });
        }

        // Set default values for is_staff and is_superuser
        if (!is_staff) is_staff = false;
        if (!is_superuser) is_superuser = false;

        // Check if username is available
        const result = await db.query(`SELECT * FROM auth_user WHERE username = $1`, [username]);
        if (result.rowCount > 0) {
            return res.status(406).json('There is already user with this username');
        }

        // Insert new user
        const date = new Date().toISOString();
        await db.query(`
            INSERT INTO auth_user (password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
            [password, date, is_superuser, username, first_name, last_name, email, is_staff, false, date]
        );

        res.status(201).json("New user created");
    }


    async getUsers(req, res) {
        const result = await db.query(`SELECT * FROM auth_user`);
        res.json(result.rows);
    }

    async getOneUser(req, res) {
        const userId = req.params.id;
        const result = await db.query(`SELECT * FROM auth_user WHERE id = ${userId}`);
        if (result.rowCount === 0) {
            return res.status(404).json("User not found");
        }
        res.json(result.rows[0]);
    }


    async updateUser(req, res) {
        const { username, email, password, is_superuser, is_staff, first_name, last_name } = req.body;
        const userId = req.params.id;

        // Check that at least one field was provided
        if (!(username || email || password || is_superuser || is_staff || first_name || last_name)) {
            res.status(400).json({ message: "Username, email, password, is_superuser, is_staff, firs_name or last_name required " });
            return;
        }

        // Check that user exists
        const result = await db.query(
            `SELECT * FROM auth_user WHERE id = $1`,
            [userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json("User not found");
        }

        // Build update query
        let query = `UPDATE auth_user SET `;
        if (username) query += `username = '${username}', `;
        if (email) query += `email = '${email}', `;
        if (password) query += `password = '${password}', `;
        if (is_superuser) query += `is_superuser = '${is_superuser}', `;
        if (is_staff) query += `is_staff = '${is_staff}', `;
        if (first_name) query += `first_name = '${first_name}', `;
        if (last_name) query += `last_name = '${last_name}', `;
        query = query.slice(0, -2); // remove last comma and space
        query += ` WHERE id = '${userId}'`;

        // Execute update query
        try {
            await db.query(query);
            res.status(200).json({ message: "User updated" });
        } catch (error) {
            res.status(500).json(error);
        }
    }


    async deleteUser(req, res) {
        const userId = req.params.id;

        // Check that user exists
        const result = await db.query(
            `SELECT * FROM auth_user WHERE id = $1`,
            [userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json("User not found");
        }

        // Execute delete query
        try {
            await db.query(`DELETE FROM auth_user WHERE id = ${userId}`);
            res.status(200).json({ message: "User deleted" });
        } catch (error) {
            res.status(500).json(error);
        }
    }

}

module.exports = new UserController();
```
