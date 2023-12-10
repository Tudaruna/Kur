import pool from "../db.js";

class Controller {
  async addProject(req, res) {
    try {
      const { name, description, type, deadline } = req.body;
      const userId = req.query.userId;
      console.log(userId);
      const splitDate = deadline.split("-");
      const convertedDeadline = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;

      const projectAdd = await pool.query(
        "INSERT INTO projects (name, description, type, deadline, date_create, status, user_id, module_count) VALUES ($1, $2, $3, $4, CURRENT_DATE, false, $5, 0) RETURNING *",
        [name, description, type, convertedDeadline, userId]
      );
      return res.json({ project: projectAdd.rows[0] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getProject(req, res) {
    try {
      const userId = req.query.userId; // Получаем userId из запроса
      const projectList = await pool.query(
        "SELECT * FROM projects WHERE user_id = $1",
        [userId]
      );
      res.json(projectList.rows);
    } catch (error) {
      console.error("Error while fetching projects:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  async getProjectById(req, res) {
    try {
      const projectId = req.params.id; // Получаем projectId из запроса
      const project = await pool.query(
        "SELECT projects.*, users.name as author_name FROM projects JOIN users ON projects.user_id = users.user_id WHERE projects.id = $1",
        [projectId]
      );
  
      if (project.rows.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }
      console.log(project.rows[0])
      res.json(project.rows[0]); // Возвращаем первый (и единственный) проект
    } catch (error) {
      console.error("Error while fetching project:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProject(req, res) {
    try {
      const projectId = req.params.id;
      const userId = req.query.userId;;
      console.log(projectId);
      const projectDel = await pool.query(
        "DELETE FROM projects WHERE id=$1 AND user_id=$2",
        [projectId, userId]
      );
      
      console.log(projectId);

      if (projectDel.rowCount === 0) {
        return res.status(404).json({
          message: `Task with id ${projectId} not found or not associated with user ${userId}`,
        });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async editProject(req, res) {
    if (!req.body || !req.query.userId) {
      console.log(req.body);
      console.log(req.query.userId);
      return res.status(400).json({ error: error.message });
    }
    try {
      const projectId = req.params.id;
      const { name, description, type, deadline } = req.body;
      const userId = req.query.userId;

      const projectEdit = await pool.query(
        "UPDATE projects SET name=$1, description=$2, type=$3, deadline=$4 WHERE id=$5 AND user_id=$6 RETURNING *",
        [name, description, type, deadline, projectId, userId]
      );

      if (projectEdit.rowCount === 0) {
        return res.status(404).json({
          message: `Task with id ${projectId} not found or not associated with user ${userId}`,
        });
      }
      res.json({
        message: `Task with id ${projectId} was updated`,
        project: projectEdit.rows[0],
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}

export default new Controller();
