import pool from "../db.js";
import multer from "multer";

class module {
  async addModule(req, res) {
    try {
      const { moduleName } = req.body;
      const projectId = req.query.projectId;
      const moduleAdd = await pool.query(
        "INSERT INTO modules (module_name, project_id) VALUES ($1, $2) RETURNING *",
        [moduleName, projectId]
      );

      const updateProjectModuleCount = await pool.query(
        "UPDATE projects SET module_count = module_count + 1 WHERE id = $1 RETURNING *",
        [projectId]
      );

      return res.json({
        module: moduleAdd.rows[0],
        updatedProject: updateProjectModuleCount.rows[0],
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getModules(req, res) {
    try {
      const projectId = req.query.projectId; // Получаем projectId из запроса
      const moduleList = await pool.query(
        "SELECT * FROM modules WHERE project_id = $1",
        [projectId]
      );

      res.json(moduleList.rows);
    } catch (error) {
      console.error("Error while fetching modules:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteModule(req, res) {
    try {
      const moduleId = req.params.id;
      const projectId = req.query.projectId;
      const moduleDel = await pool.query(
        "DELETE FROM modules WHERE module_id = $1",
        [moduleId]
      );

      if (moduleDel.rowCount === 0) {
        return res.status(404).json({
          message: `Module with id ${moduleId} not found`,
        });
      }


      const updateProjectModuleCount = await pool.query(
        "UPDATE projects SET module_count = module_count - 1 WHERE id = $1 RETURNING *",
        [projectId]
      );

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }


}

export default new module();
