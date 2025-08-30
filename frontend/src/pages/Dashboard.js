import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from the backend
    axios.get('/api/cases')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  const updateTaskStatus = (taskId, status) => {
    // API call to update task status
    axios.put(`/api/cases/${taskId}/status`, { status })
      .then(response => {
        setTasks(tasks.map(task => task._id === taskId ? { ...task, status } : task));
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="task-column">
        <h3>To Do</h3>
        {tasks.filter(task => task.status === 'To Do').map(task => (
          <div key={task._id} className="task-card">
            <h4>{task.title}</h4>
            <button onClick={() => updateTaskStatus(task._id, 'In Progress')}>Start</button>
          </div>
        ))}
      </div>

      <div className="task-column">
        <h3>In Progress</h3>
        {tasks.filter(task => task.status === 'In Progress').map(task => (
          <div key={task._id} className="task-card">
            <h4>{task.title}</h4>
            <button onClick={() => updateTaskStatus(task._id, 'Done')}>Complete</button>
          </div>
        ))}
      </div>

      <div className="task-column">
        <h3>Done</h3>
        {tasks.filter(task => task.status === 'Done').map(task => (
          <div key={task._id} className="task-card">
            <h4>{task.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
