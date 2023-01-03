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