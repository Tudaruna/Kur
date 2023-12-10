import pool from "../db.js";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt.helpers.js";

class Controller {
  async login(req, res) {
    try {
      const { email, password } = req.body; //запрос с клиента

      //Поиска пользователя с такой почтой
      const users = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      //   Проверка на существование
      if (users.rows.length === 0)
        return res.status(404).json({ error: "Данный пользователь не найден" });
      // Проверка пароля
      const validPassword = await bcrypt.compare(
        password,
        users.rows[0].password_hash
      );
      if (!validPassword)
        return res.status(401).json({ error: "Неверный пароль" });
      return res.json(users.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async register(req, res) {
    try {
      const { email, login, password } = req.body;

      // Проверка на регистрацию
      const userAlreadyExists = await pool.query(
        "SELECT * FROM users WHERE email = $1 OR login = $2",
        [email, login]
      );

      if (userAlreadyExists.rows.length > 0) {
        return res.status(409).json({
          error: "Пользователь с таким email или login уже зарегистрирован",
        });
      }

      // Хэширование пароля
      const salt = await bcrypt.genSalt(8);
      if (!password) {
        return res.status(400).json({ error: "Пароль обязателен" });
      }

      const hashedPassword = await bcrypt.hash(password, salt);

      // Добавление пользователя
      const newUser = await pool.query(
        "INSERT INTO users (email, login, password_hash) VALUES ($1, $2, $3) RETURNING *",
        [email, login, hashedPassword]
      );

      // Отображение в ответе
      return res.json({ user: newUser.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const {
        firstName,
        lastName,
        birthday,
        sex,
        phone,
        newPassword,
        currentPassword,
      } = req.body;

      const userId = req.params.id;
      if (!req.body || !req.params.id) {
        console.log(req.body);
        console.log(req.params.id);
        return res.status(400).json({ error: error.message });
      }
      let fullName
      if(firstName && lastName){
       fullName = `${firstName} ${lastName}`;
      }
      let hashedPassword;
      const users = await pool.query("SELECT * FROM users WHERE user_id = $1", [
        userId,
      ]);

      if (newPassword && currentPassword) {
        const validPassword = await bcrypt.compare(
          currentPassword,
          users.rows[0].password_hash
        );
        if (!validPassword)
          return res.status(401).json({ error: "Неверный пароль" });

        const salt = await bcrypt.genSalt(8);
        hashedPassword = await bcrypt.hash(newPassword, salt);
      }
      // Update the user profile information
      const updatedUser = await pool.query(
        "UPDATE users SET name = COALESCE($1, name), birthday = COALESCE($2, birthday), sex = COALESCE($3, sex), phone = COALESCE($4, phone), password_hash = COALESCE($5, password_hash) WHERE user_id = $6 RETURNING *",
        [fullName, birthday, sex, phone, hashedPassword, userId]
      );

      if (updatedUser.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return the updated user profile
      return res.json({ user: updatedUser.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  async deleteAccount(req, res) {
    try {
      const userId = req.params.id;
  
      // Check if the user exists
      const userExists = await pool.query(
        "SELECT * FROM users WHERE user_id = $1",
        [userId] 
      );
  
      if (userExists.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Delete the user
      await pool.query("DELETE FROM users WHERE user_id = $1", [userId]);
  
      res.json({ success: true });
    } catch (error) {
      console.error("Error while deleting user:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new Controller();

