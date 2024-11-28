const tasks = document.getElementById("tasks");
let l = [];
let m = [];
let h = [];
let total = [];
let icon = document.querySelector(".icon");
let nav = document.querySelector("nav");
let close = document.querySelector(".close");
let del = document.querySelector(".delete");
const taskLi = document.getElementById("taskLi");
let tD = null;
let vP = 0;

window.onload = function () {
  loadTasksFromLocalStorage();
};

// Submit event for adding tasks
tasks.addEventListener("submit", (e) => {
  e.preventDefault();
  const dateTime = new Date(document.getElementById("taskDeadline").value);
  const taskTD = document.getElementById("taskTimeDeadline").value;
  const taskName = document.getElementById("taskName").value;
  const taskDescription = document.getElementById("taskDescription").value;
  const taskPriority = document.getElementById("taskPriority").value;
  let taskDateDeadLine;
  let taskDeadline;
  
  const currentDate1 = new Date();
  const dueDate1 = new Date(taskDeadline);
  const timeDifference1 = dueDate1 - currentDate1;
  const taskSecondsRemaining = Math.floor(timeDifference1 / 1000);

  if (taskTD) {
    tD = true;
    taskDateDeadLine = String(dateTime.toISOString().split("T")[0]);
    taskDeadline = taskDateDeadLine + " " + document.getElementById("taskTimeDeadline").value + ":00";
  } else {
    taskDeadline = dateTime;
    tD = false;
  }

  if (taskPriority === "1") {
    vP = "Low";
  } else if (taskPriority === "2") {
    vP = "Med";
  } else {
    vP = "High";
  }

  const group = {
    name: taskName,
    description: taskDescription,
    priority: taskPriority,
    valuePriority: vP,
    deadline: taskDeadline,
    timerSeconds: 1500,
    timerInterval: null,
    completed: false,
    secondsRemaining: taskSecondsRemaining
  };

  if (taskPriority === "1") {
    l.push(group);
    l.sort((a, b) => a.secondsRemaining - b.secondsRemaining);
  } else if (taskPriority === "2") {
    m.push(group);
    m.sort((a, b) => a.secondsRemaining - b.secondsRemaining);
  } else {
    h.push(group);
    h.sort((a, b) => a.secondsRemaining - b.secondsRemaining);
  }

  total = [...h, ...m, ...l];
  taskLi.innerHTML = "";
  displayTasks(total);
  saveTasksToLocalStorage();
  tasks.reset();
});

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
  deleteClick();
}

// Timer controls logic
function startTimer(event) {
  const index = event.target.getAttribute("data-index");
  const task = total[index];
  
  if (task.timerInterval) {
    clearInterval(task.timerInterval);
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
      checked.classList.add("checked");
    }
  }, 1000);
}

function stopTimer(event) {
  const index = event.target.getAttribute("data-index");
  const task = total[index];

  clearInterval(task.timerInterval);
  task.timerInterval = null;
  updateTimerDisplay(task, index);
  saveTasksToLocalStorage();
}

function restTimer(event) {
  const index = event.target.getAttribute("data-index");
  const task = total[index];

  task.timerSeconds = 1500;
  updateTimerDisplay(task, index);
}

function updateTimerDisplay(task, index) {
  const timerValueElement = document.querySelectorAll(".task-item .value")[index];
  timerValueElement.textContent = formatTime(task.timerSeconds);
}

function updateTimeDeadline(task, index) {
  const timerValueElement = document.querySelectorAll(".task-item #color")[index];
  const currentDate1 = new Date();
  const dueDate1 = new Date(task.deadline);
  const timeDifference1 = dueDate1 - currentDate1;
  const taskSecondsRemaining = Math.floor(timeDifference1 / 1000);
  
  task.secondsRemaining = taskSecondsRemaining;
  timerValueElement.textContent = formatTime1(task.secondsRemaining, true);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secondsLeft = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secondsLeft}`;
}

function formatTime1(seconds, isDeadline) {
  if (isDeadline) {
    if (seconds >= 0) {
      const days = Math.floor(seconds / (24 * 60 * 60));
      const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((seconds % (60 * 60)) / 60);
      const remainingSeconds = seconds % 60;
      return `${days} d ${hours} hr ${minutes} min ${remainingSeconds} sec left`;
    } else {
      const pSec = -seconds;
      const days = Math.floor(pSec / (24 * 60 * 60));
      const hours = Math.floor((pSec % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((pSec % (60 * 60)) / 60);
      const remainingSeconds = pSec % 60;
      return `Overdue: ${days} d ${hours} hr ${minutes} min ${remainingSeconds} sec had gone`;
    }
  } else {
    if (seconds >= 0) {
      const days = Math.floor(seconds / (24 * 60 * 60));
      const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
      return `${days} d ${hours} hr left`;
    } else {
      const pSec = -seconds;
      const days = Math.floor(pSec / (24 * 60 * 60));
      const hours = Math.floor((pSec % (24 * 60 * 60)) / (60 * 60));
      return `Overdue: ${days} d ${hours} hr had gone`;
    }
  }
}

function playAlarm() {
  const audio = new Audio("/audio/beeb.wav");
  audio.play();
}

function deleteTask(index) {
  const task = total[index];
  if (task.priority === "1") {
    l.splice(index, 1);
  } else if (task.priority === "2") {
    m.splice(index, 1);
  } else {
    h.splice(index, 1);
  }
  total = [...h, ...m, ...l];
  saveTasksToLocalStorage();
  taskLi.innerHTML = "";
  displayTasks(total);
}

function deleteClick() {
  document.querySelectorAll(".delete").forEach((del) => {
    del.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      deleteTask(index);
      addEventListenersToTaskButtons();
    });
  });
}

function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(total));
}

function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    total = JSON.parse(storedTasks);
    l = total.filter(task => task.priority === "1");
    m = total.filter(task => task.priority === "2");
    h = total.filter(task => task.priority === "3");
    displayTasks(total);
  }
}

function displayTasks(total) {
  for (let i = 0; i < total.length; i++) {
    const task = total[i];
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
        <nav class="task-nav">
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
        <div class="taskInfo">
          <div class="taskColor">${formatTime1(task.secondsRemaining, true)}</div>
          <div class="taskPriorityDisplay">
            <p>Priority level: </p>
            <p class="para">${task.valuePriority}</p>
          </div>
        </div>
        <div class="space">
          <button class="delete" data-index="${i}">Delete</button>
          <img src="/img/check.png" alt="check" class="check ${task.completed ? 'checked' : ''}">
        </div>
      </div>
    `;
    taskLi.appendChild(taskItem);
    addEventListenersToTaskButtons();
  }
}
