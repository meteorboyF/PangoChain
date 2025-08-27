import React, { useState } from "react";
import "./Cases.css";

function Cases() {
  const [tasks, setTasks] = useState({
    todo: ["Draft contract", "Collect client documents"],
    inProgress: ["Review evidence"],
    done: ["Initial consultation"]
  });

  const moveTask = (task, from, to) => {
    setTasks((prev) => {
      const updated = { ...prev };
      updated[from] = updated[from].filter((t) => t !== task);
      updated[to] = [...updated[to], task];
      return updated;
    });
  };

  return (
    <div className="cases">
      <h2>Case Management</h2>
      <div className="kanban">
        {Object.keys(tasks).map((col) => (
          <div className="kanban-column" key={col}>
            <h3>{col.toUpperCase()}</h3>
            {tasks[col].map((task, i) => (
              <div key={i} className="task-card">
                {task}
                <div className="task-actions">
                  {col !== "todo" && (
                    <button onClick={() => moveTask(task, col, "todo")}>⬅ To Do</button>
                  )}
                  {col !== "inProgress" && (
                    <button onClick={() => moveTask(task, col, "inProgress")}>➡ In Progress</button>
                  )}
                  {col !== "done" && (
                    <button onClick={() => moveTask(task, col, "done")}>✅ Done</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cases;
