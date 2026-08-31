import React, { useEffect, useState } from "react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask as deleteTaskAPI,
} from "../services/taskService";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ============================================
  // LOGGED-IN USER
  // ============================================

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data:", error);
      }
    }
  }, []);

  // ============================================
  // NEW TASK
  // ============================================

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  // ============================================
  // GET TASKS FROM BACKEND
  // ============================================

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTasks();

      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Failed to load tasks:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  // Load tasks when dashboard opens
  useEffect(() => {
    loadTasks();
  }, []);

  // ============================================
  // STATISTICS
  // ============================================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  // ============================================
  // TOGGLE COMPLETE
  // ============================================

  const toggleTask = async (task) => {
    try {
      const data = await updateTask(task._id, {
        completed: !task.completed,
      });

      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          item._id === task._id
            ? data.task
            : item
        )
      );
    } catch (error) {
      console.error(
        "Failed to update task:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update task"
      );
    }
  };

  // ============================================
  // DELETE TASK
  // ============================================

  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTaskAPI(id);

      setTasks((prevTasks) =>
        prevTasks.filter(
          (task) => task._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete task"
      );
    }
  };

  // ============================================
  // FORM INPUT
  // ============================================

  const handleChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  // ============================================
  // CREATE TASK
  // ============================================

  const addTask = async (e) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    try {
      const data = await createTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        dueDate: newTask.dueDate || null,
      });

      setTasks((prevTasks) => [
        data.task,
        ...prevTasks,
      ]);

      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
      });

      setShowModal(false);
    } catch (error) {
      console.error(
        "Failed to create task:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to create task"
      );
    }
  };

  // ============================================
  // PRIORITY STYLE
  // ============================================

  const getPriorityClass = (priority) => {
    if (priority === "High") {
      return "bg-red-100 text-red-600";
    }

    if (priority === "Medium") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-600";
  };

  // ============================================
  // DATE FORMAT
  // ============================================

  const formatDate = (date) => {
    if (!date) return "No due date";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ============================================
  // DYNAMIC USER VALUES
  // ============================================

  const userName =
    user?.name ||
    user?.username ||
    user?.displayName ||
    "User";

  const userInitial = userName
    .charAt(0)
    .toUpperCase();

  // ============================================
  // UI
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =========================================
          NAVBAR
      ========================================= */}

      <nav className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* LOGO */}

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              TaskFlow
            </h1>

            <p className="text-xs text-gray-500">
              Task Management
            </p>
          </div>

          {/* USER */}

          <div className="flex items-center gap-4">

            {/* DYNAMIC USER NAME */}

            <div className="hidden sm:block text-right">

              <p className="text-sm font-semibold text-gray-800">
                {userName}
              </p>

              <p className="text-xs text-gray-500">
                Welcome back
              </p>

            </div>

            {/* DYNAMIC INITIAL */}

            <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
              {userInitial}
            </div>

            {/* LOGOUT */}

            <button
              className="hidden sm:block text-sm text-gray-600 hover:text-red-500 transition"
              onClick={() =>
                alert(
                  "Logout functionality will be added later"
                )
              }
            >
              Logout
            </button>

          </div>

        </div>

      </nav>


      {/* =========================================
          MAIN
      ========================================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>

            <h2 className="text-3xl font-bold text-gray-900">
              Good Morning 👋
            </h2>

            <p className="text-gray-500 mt-1">
              Let's get your tasks done today.
            </p>

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            + Add Task
          </button>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}


        {/* =========================================
            STATISTICS
        ========================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

          {/* TOTAL */}

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">

            <p className="text-gray-500 text-sm">
              Total Tasks
            </p>

            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              {totalTasks}
            </h3>

          </div>


          {/* PENDING */}

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">

            <p className="text-gray-500 text-sm">
              Pending
            </p>

            <h3 className="text-3xl font-bold text-orange-500 mt-2">
              {pendingTasks}
            </h3>

          </div>


          {/* COMPLETED */}

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">

            <p className="text-gray-500 text-sm">
              Completed
            </p>

            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {completedTasks}
            </h3>

          </div>

        </div>


        {/* =========================================
            PROGRESS
        ========================================= */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">

          <div className="flex justify-between items-center mb-3">

            <div>

              <h3 className="font-bold text-gray-900">
                Overall Progress
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {completedTasks} of{" "}
                {totalTasks} tasks completed
              </p>

            </div>

            <span className="text-2xl font-bold text-gray-900">
              {progress}%
            </span>

          </div>


          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">

            <div
              className="h-full bg-gray-900 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>


        {/* =========================================
            TASK HEADER
        ========================================= */}

        <div className="flex items-center justify-between mb-5">

          <div>

            <h3 className="text-2xl font-bold text-gray-900">
              My Tasks
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Manage your daily tasks
            </p>

          </div>

          <span className="text-sm text-gray-500">
            {totalTasks} tasks
          </span>

        </div>


        {/* =========================================
            LOADING
        ========================================= */}

        {loading ? (

          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">

            <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full mx-auto mb-4" />

            <p className="text-gray-500">
              Loading tasks...
            </p>

          </div>

        ) : (

          /* =========================================
             TASK LIST
          ========================================= */

          <div className="space-y-4">

            {tasks.length === 0 ? (

              <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">

                <div className="text-4xl mb-3">
                  📝
                </div>

                <h3 className="font-bold text-gray-800">
                  No tasks yet
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  Click "Add Task" to create your
                  first task.
                </p>

              </div>

            ) : (

              tasks.map((task) => (

                <div
                  key={task._id}
                  className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm transition ${
                    task.completed
                      ? "opacity-70"
                      : "hover:shadow-md"
                  }`}
                >

                  <div className="flex items-start gap-4">

                    {/* CHECKBOX */}

                    <button
                      onClick={() =>
                        toggleTask(task)
                      }
                      className={`w-7 h-7 min-w-7 rounded-full border-2 flex items-center justify-center mt-1 transition ${
                        task.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-gray-900"
                      }`}
                    >
                      {task.completed && "✓"}
                    </button>


                    {/* CONTENT */}

                    <div className="flex-1 min-w-0">

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                        <div>

                          <h4
                            className={`text-lg font-semibold ${
                              task.completed
                                ? "line-through text-gray-400"
                                : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h4>

                          {task.description && (

                            <p
                              className={`text-sm mt-1 ${
                                task.completed
                                  ? "text-gray-400 line-through"
                                  : "text-gray-500"
                              }`}
                            >
                              {task.description}
                            </p>

                          )}

                        </div>


                        {/* DELETE */}

                        <button
                          onClick={() =>
                            deleteTask(task._id)
                          }
                          className="text-sm text-red-500 hover:text-red-700 font-medium"
                        >
                          🗑 Delete
                        </button>

                      </div>


                      {/* DETAILS */}

                      <div className="flex flex-wrap items-center gap-3 mt-4">

                        <span
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getPriorityClass(
                            task.priority
                          )}`}
                        >
                          {task.priority} Priority
                        </span>


                        <span className="text-xs text-gray-500">
                          📅{" "}
                          {formatDate(
                            task.dueDate
                          )}
                        </span>


                        <span
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                            task.completed
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {task.completed
                            ? "Completed"
                            : "Pending"}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        )}


      </main>


      {/* =========================================
          ADD TASK MODAL
      ========================================= */}

      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">

            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Add New Task
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Create a task to stay organized.
                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={addTask}
              className="p-6 space-y-5"
            >

              {/* TITLE */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleChange}
                  placeholder="e.g. Complete MERN project"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
                />

              </div>


              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleChange}
                  placeholder="Describe your task..."
                  rows="3"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />

              </div>


              {/* PRIORITY */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>

                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
                >

                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                </select>

              </div>


              {/* DATE */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
                />

              </div>


              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800"
                >
                  Add Task
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;