import React, { useState } from "react";
import "./Cases.css";

function Cases() {
  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, title: "Draft Contract", description: "Prepare draft" },
      { id: 2, title: "Collect Documents", description: "Gather evidence" },
    ],
    inProgress: [{ id: 3, title: "Review Evidence", description: "Check docs" }],
    done: [{ id: 4, title: "Client Meeting", description: "Initial discussion" }],
  });

  const onDragStart = (e, task, column) => {
    e.dataTransfer.setData("task", JSON.stringify({ task, column }));
  };

  const onDrop = (e, newColumn) => {
    const { task, column } = JSON.parse(e.dataTransfer.getData("task"));
    if (column !== newColumn) {
      setTasks((prev) => {
        const updated = { ...prev };
        updated[column] = prev[column].filter((t) => t.id !== task.id);
        updated[newColumn] = [...prev[newColumn], task];
        return updated;
      });
    }
  };

  return (
    <div className="cases">
      <h2>Case Management</h2>
      <div className="kanban-board">
        {["todo", "inProgress", "done"].map((col) => (
          <div
            key={col}
            className="kanban-column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, col)}
          >
            <h3>{col === "todo" ? "To Do" : col === "inProgress" ? "In Progress" : "Done"}</h3>
            {tasks[col].map((task) => (
              <div
                key={task.id}
                className="task-card"
                draggable
                onDragStart={(e) => onDragStart(e, task, col)}
              >
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cases;
