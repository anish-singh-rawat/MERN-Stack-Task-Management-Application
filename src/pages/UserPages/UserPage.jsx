import React, { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTitle, setSearchTitle] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(""); // ✅ Store logged-in user
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    progress: 0,
  });

  useEffect(() => {
    // ✅ Fetch logged-in user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setLoggedInUser(storedUser?.name || "Unknown User");

    // ✅ Fetch stored tasks
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

  // Handle Task Creation
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.description.trim()) return;

    const taskId = Date.now().toString();
    
    // ✅ Assign task to logged-in user
    const newTaskItem = { 
      id: taskId, 
      ...newTask, 
      assignedTo: loggedInUser // ✅ Store assigned user
    };

    const updatedTasks = [...tasks, newTaskItem];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    toast.success("Task added successfully!", { icon: "✅" });

    setNewTask({ title: "", description: "", priority: "Medium", deadline: "", progress: 0 });
  };

  // Handle Task Deletion
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    toast.error("Task removed successfully!", { icon: "🗑️" });
  };

  // Handle Progress Update
  const updateProgress = (taskId, progress) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, progress: parseInt(progress) } : task
    );

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // Function to get priority color
  const getPriorityColor = (priority) => {
    if (priority === "High") return "text-red-600 font-bold";
    if (priority === "Medium") return "text-yellow-600 font-bold";
    return "text-green-600 font-bold"; // Low priority
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <UserSidebar />

      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold mb-6 text-center w-full">
          <span>🎯</span> 
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            User Task Management
          </span>
        </h1>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        {/* Task Creation Box */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create a New Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            {/* ...existing code... */}
          </form>
        </div>

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

        {/* Task List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.length === 0 ? (
            <p className="text-gray-600">No tasks found.</p>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="bg-white shadow-md p-4 rounded-md border-l-4 border-blue-400">
                {/* ...existing code for task display... */}
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <span className={`text-sm ${getPriorityColor(task.priority)}`}>Priority: {task.priority}</span>
                <p className="text-sm text-gray-700 mt-1"><span className="font-semibold">Assigned To:</span> {task.assignedTo}</p>
                <p className="text-sm text-gray-700 mt-1"><span className="font-semibold">Deadline:</span> {task.deadline}</p>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Progress:</label>
                  <input type="range" min="0" max="100" value={task.progress} onChange={(e) => updateProgress(task.id, e.target.value)} className="w-full mt-2 accent-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{task.progress}% Completed</span>
                </div>
                <button onClick={() => handleDeleteTask(task.id)} className="mt-4 w-full bg-red-600 text-white p-2 rounded-lg font-semibold hover:bg-red-700 transition-all">🗑️ Delete Task</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
