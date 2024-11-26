const tasks = document.getElementById("tasks");
let l = [];
let m = [];
let h = [];
let total = [];
const taskLi = document.getElementById("taskLi");

tasks.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const taskDescription = document.getElementById("taskDescription").value;
  const taskPriority = document.getElementById("taskPriority").value;
  const taskDueDate = document.getElementById("taskDueDate").value;

  const group = {
    name: taskName,
    description: taskDescription,
    priority: taskPriority,
    dueDate: taskDueDate,
    timerSeconds: 1500, // Initial timer set to 25 minutes
    timerInterval: null,
    completed: false,
  };

  // Add the task to the respective list based on priority
  if (taskPriority === "1") {
    l.push(group);
  } else if (taskPriority === "2") {
    m.push(group);
  } else {
    h.push(group);
  }

  total = [...h, ...m, ...l];

  taskLi.innerHTML = ""; // Clear the task list before re-rendering
  displayTasks(total); // Re-render the tasks
  tasks.reset(); // Res
