const tasks = document.getElementById("tasks");
let l = []; // Low priority tasks array
let m = []; // Mid priority tasks array
let h = []; // High priority tasks array
let total = [];
const taskLi = document.getElementById("taskLi");

tasks.addEventListener("submit", (e) => {
    e.preventDefault();
 
    const taskName = document.getElementById("taskName").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const taskPriority = document.getElementById("taskPriority").value;

    // Create a task object with name, description, and priority
    const task = {
        name: taskName,
        description: taskDescription,
        priority: taskPriority,
    };
    
    // Add task to the appropriate array based on priority
    if (taskPriority === "Low") {
        l.push(task);
    } else if (taskPriority === "Mid") {
        m.push(task);
    } else {
        h.push(task);
    }
    
    // Combine all tasks into a single array and sort by priority
    total = [...h, ...m, ...l]; // High > Mid > Low

    // Sorting the tasks by priority (High > Mid > Low)
    total.sort((a, b) => {
        const priorityOrder = { "High": 3, "Mid": 2, "Low": 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority]; // Sort in descending order
    });

    // Clear the task list and display sorted tasks
    taskLi.innerHTML = "";  // Clear current tasks
    total.forEach((task) => {
        const taskElement = document.createElement("li");
        taskElement.classList.add("task", `task-${task.priority.toLowerCase()}`);
        taskElement.innerHTML = `
            <div id="delete">
                <strong>${task.name}</strong>
                <div>${task.description}</div>
            </div>
        `;
        taskLi.appendChild(taskElement);
    });

    tasks.reset();  // Reset the form
});
