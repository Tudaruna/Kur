import fs from "fs";
import { fileURLToPath, URL } from "url";
import { dirname } from "path";
import pool from "../db.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Controller {
  async uploadModuleFile(req, res) {
    try {
      const { moduleId } = req.body;
      const file = req.file;

      console.log(req.body);
      console.log(moduleId);

      if (!moduleId || !file) {
        return res.status(400).json({ error: "Invalid request data" });
      }

      const fileData = fs.readFileSync(file.path); // Read the file content

      const query =
        "INSERT INTO module_files (module_id, file_name, file_data, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *";
      const result = await pool.query(query, [
        moduleId,
        file.originalname,
        fileData,
      ]);

      // Удаление временного файла после сохранения в базе данных
      fs.unlinkSync(file.path);

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error while uploading module file:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  async getModuleFiles(req, res) {
    try {
      const moduleId = req.query.moduleId;
      // Проверка существования модуля с указанным module_id
      const moduleExistsQuery = "SELECT * FROM modules WHERE module_id = $1";
      const moduleExistsResult = await pool.query(moduleExistsQuery, [
        moduleId,
      ]);

      if (moduleExistsResult.rows.length === 0) {
        return res
          .status(400)
          .json({ error: "Module with specified id does not exist" });
      }

      const query =
        "SELECT id, file_name FROM module_files WHERE module_id = $1";
      const result = await pool.query(query, [moduleId]);

      res.json(result.rows);
    } catch (error) {
      console.error("Error while fetching module files:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  async getFile(req, res) {
    try {
      const fileId = req.params.id;

      const fileInfo = await pool.query(
        "SELECT file_name, file_data FROM module_files WHERE id = $1",
        [fileId]
      );

      if (fileInfo.rows.length === 0) {
        return res.status(404).json({ error: "File not found" });
      }

      const fileName = fileInfo.rows[0].file_name;
      const fileData = fileInfo.rows[0].file_data;
      res.set({
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename=${fileName}`,
      });
      res.send(fileData);
    } catch (error) {
      console.error("Error while fetching module file:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
  async deleteModuleFile(req, res) {
    try {
      const fileId = req.params.id;

      const fileInfo = await pool.query(
        "SELECT * FROM module_files WHERE id = $1",
        [fileId]
      );
      if (fileInfo.rows.length === 0) {
        return res.status(404).json({ error: "File not found" });
      }


      await pool.query("DELETE FROM module_files WHERE id = $1", [fileId]);

      res.json({ success: true });
    } catch (error) {
      console.error("Error while deleting module file:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new Controller();
