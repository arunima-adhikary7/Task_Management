import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

// Get token from localStorage
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// GET all tasks
export const getTasks = async () => {
  const response = await axios.get(
    API_URL,
    getAuthConfig()
  );

  return response.data;
};

// CREATE task
export const createTask = async (taskData) => {
  const response = await axios.post(
    API_URL,
    taskData,
    getAuthConfig()
  );

  return response.data;
};

// UPDATE task
export const updateTask = async (id, taskData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    taskData,
    getAuthConfig()
  );

  return response.data;
};

// DELETE task
export const deleteTask = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthConfig()
  );

  return response.data;
};