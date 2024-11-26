const tasks = document.getElementById("tasks");
let l = [];
let m = [];
let h = [];
let total = [];
const taskLi = document.getElementById("taskLi");

// Load tasks from localStorage on page load
window.onload = function() {
  loadTasksFromLocalStorage();
};

// Handle form submission to add a new task
tasks.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const taskDescription = document.getElementById("taskDescription").value;
  const taskPriority = document.getElementById("taskPriority").value;
  const taskDeadline = document.getElementById("taskDeadline").value;

  const group = {
    name: taskName,
    description: taskDescription,
    priority: taskPriority,
    deadline: taskDeadline,
    timerSeconds: 2, // Initial timer seconds (you can adjust this)
    timerInterval: null,
    completed: false,
  };

  // Add the task to the corresponding priority array
  if (taskPriority === "1") {
    l.push(group);
  } else if (taskPriority === "2") {
    m.push(group);
  } else {
    h.push(group);
  }

  // Combine all the tasks into the `total` array based on priority
  total = [...h, ...m, ...l];

  // Clear the task list, display the updated tasks, and save to localStorage
  taskLi.innerHTML = "";
  displayTasks(total);
  saveTasksToLocalStorage();
  addEventListenersToTaskButtons();
  tasks.reset();  // Reset the form after adding the task
});

// Function to add event listeners to task buttons (Start, Stop, Rest, Delete)
function addEventListenersToTaskButtons() {
  document.querySelectorAll(".icon").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const nav = event.target.closest("li").querySelector("nav");
      nav.classList.add("open");
    });
  });

  document.querySelectorAll(".close").forEach((close) => {
    close.addEventListener("click", (event) => {
      const nav = event.target.closest("nav");
      nav.classList.remove("open");
    });
  });

  document.querySelectorAll(".start").forEach((button) => {
    button.addEventListener("click", startTimer);
  });

  document.querySelectorAll(".stop").forEach((button) => {
    button.addEventListener("click", stopTimer);
  });

  document.querySelectorAll(".rest").forEach((button) => {
    button.addEventListener("click", restTimer);
  });

  deleteClick();  // Add event listeners for delete buttons
}

// Function to start the timer
function startTimer(event) {
  const index = event.target.getAttribute("data-index");
  const task = total[index];

  if (task.timerInterval) {
    clearInterval(task.timerInterval); // Clear any existing interval
  }

  task.timerInterval = setInterval(() => {
    task.timerSeconds--;
    updateTimerDisplay(task, index);

    if (task.timerSeconds <= 0) {
      clearInterval(task.timerInterval);
      task.timerInterval = null;
      playAlarm();
      task.completed = true;
      const checked = event.target.closest("li").querySelector(".check");
      checked.classList.remove("check");
    }
  }, 1000);
}

// Function to stop the timer
function stopTimer(event) {
  const index = event.target.getAttribute("data-index");
  const task = total[index];

  clearInterval(task.timerInterval);
  task.timerInterval = null;
  updateTimerDisplay(task, index);
}

// Function to reset the timer
function restTimer(event) {
  const index = event.target.getAttribute("data-index");
  const task = total[index];

  task.timerSeconds = 1500; // Reset to 25 minutes
  updateTimerDisplay(task, index);
}

// Function to update the timer display
function updateTimerDisplay(task, index) {
  const timerValueElement = document.querySelectorAll(".task-item .value")[index];
  timerValueElement.textContent = formatTime(task.timerSeconds);
}

// Function to format time in MM:SS format
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secondsLeft = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secondsLeft}`;
}

// Function to play alarm when timer reaches 0
function playAlarm() {
  const audio = new Audio("/audio/beeb.wav");
  audio.play();
}

// Function to delete a task
function deleteTask(index) {
  const task = total[index];
  
  // Remove the task from the correct priority array
  if (task.priority === "1") {
    l.splice(index, 1);
  } else if (task.priority === "2") {
    m.splice(index, 1);
  } else {
    h.splice(index, 1);
  }

  // Rebuild the total array after deletion
  total = [...h, ...m, ...l];
  
  // Save updated tasks to localStorage and update the UI
  saveTasksToLocalStorage();
  taskLi.innerHTML = "";
  displayTasks(total);
  addEventListenersToTaskButtons();
}

// Function to add event listeners for delete buttons
function deleteClick() {
  document.querySelectorAll(".delete").forEach((del) => {
    del.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      deleteTask(index);
    });
  });
}

// Function to save tasks to localStorage
function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(total));
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks');

  if (storedTasks) {
    total = JSON.parse(storedTasks);  // Load tasks from localStorage
    // Display tasks after loading from localStorage
    displayTasks(total);
  }
}

// Function to display tasks on the page
function displayTasks(total) {
  total.forEach((task, i) => {
    const currentDate = new Date();
    const dueDate = new Date(task.deadline);
    const timeDifference = dueDate - currentDate;
    const hoursRemaining = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(hoursRemaining / 24);
    const hours = Math.floor(hoursRemaining % 24);

    let color;
    if (hoursRemaining > 0 && hoursRemaining <= 24) {
      color = `<div class="movingArrow"> ---></div><div id="color" class="red">${days} d ${hours} hr left</div>`;
    } else if (hoursRemaining > 24 && hoursRemaining < 48) {
      color = `<div id="color" class="yellow">${days} d ${hours} hr left</div>`;
    } else if (hoursRemaining > 48 && hoursRemaining < 96) {
      color = `<div id="color" class="yellow">${days} d ${hours} hr left</div>`;
    } else if (hoursRemaining > 96) {
      color = `<div id="color">${days} d ${hours} hr left</div>`;
    } else {
      color = ``;
    }

    const taskItem = document.createElement("li");
    taskItem.classList.add("task", `task-${task.priority}`);
    taskItem.innerHTML = `
      <div id="sortedTasks" class="sortedTasks task-item">
        <div class="space">
          <strong>${task.name}</strong>
          <span class="icon">
            <img src="/img/timer.png" alt="dots" class="dots">
          </span>
        </div>
        <nav id="open" class="task-nav">
          <span class="close">
            <img src="/img/close.png" alt="x">
          </span>
          <div id="timerValue">
            <div class="value">${formatTime(task.timerSeconds)}</div>
          </div>
          <button class="start" data-index="${i}">Start</button>
          <button class="rest" data-index="${i}">Rest</button>
          <button class="stop" data-index="${i}">Stop</button>
        </nav>

        <div>${task.description}</div>
        
        <div class="space">
          ${color}
          <button class="delete" data-index="${i}">Delete</button>
          <img src="/img/check.png" alt="check" class="check ${task.completed ? 'checked' : ''}">
        </div>
      </div>
    `;
    taskLi.appendChild(taskItem);
  });

  addEventListenersToTaskButtons();
}
