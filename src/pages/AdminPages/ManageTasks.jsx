import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTitle, setSearchTitle] = useState('');

  // Load tasks from localStorage (same as User Dashboard)
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Filter and search logic
  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'completed' && task.progress < 100) return false;
    if (filterStatus === 'incomplete' && task.progress === 100) return false;
    if (searchTitle && !task.title.toLowerCase().includes(searchTitle.toLowerCase())) return false;
    return true;
  });

  // ✅ Mark task as completed
  const completeTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status: "Completed", progress: 100 } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // ❌ Delete a task
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Manage Tasks</h1>

        {/* Filter/Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTitle}
            onChange={e => setSearchTitle(e.target.value)}
            className="p-2 border rounded-lg flex-1"
          />
        </div>

        {/* Pending Tasks */}
        <div className="bg-white p-4 shadow rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">Tasks</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Title</th>
                <th className="p-2">Email</th>
                <th className="p-2">Priority</th>
                <th className="p-2">Deadline</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b">
                  <td className="p-2">{task.title}</td>
                  <td className="p-2">{task.email}</td>
                  <td className="p-2">{task.priority}</td>
                  <td className="p-2">{task.deadline}</td>
                  <td className="p-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => completeTask(task.id)}
                      >
                        ✅ Mark as Completed
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded ml-2 hover:bg-red-600"
                        onClick={() => deleteTask(task.id)}
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Completed Tasks</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Title</th>
                <th className="p-2">Email</th>
                <th className="p-2">Priority</th>
                <th className="p-2">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {tasks
                .filter((task) => task.progress === 100)
                .map((task) => (
                  <tr key={task.id} className="border-b">
                    <td className="p-2">{task.title}</td>
                    <td className="p-2">{task.email}</td>
                    <td className="p-2">{task.priority}</td>
                    <td className="p-2">{task.deadline}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageTasks;
