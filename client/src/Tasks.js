import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Tasks() {
  const { userId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
      setTasks(res.data);
    } catch (err) {
      alert("Failed to fetch tasks");
    }
  };

  // Add task
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/tasks", {
        title,
        description,
        user_id: userId,
      });
      setTasks([...tasks, res.data]);
      setTitle("");
      setDescription("");
    } catch (err) {
      alert("Failed to add task");
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  return (
    <div className="app-container">
      <h2 className="tasks-title">My Tasks</h2>

    

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="task-form">
        <input
          className="task-input"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="task-input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className="task-button">
          Add Task
        </button>
      </form>

      {/* Task List */}
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-info">
              <h3 className="task-title">{task.title}</h3>
              <p className="task-desc">{task.description}</p>
            </div>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="task-delete-button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
