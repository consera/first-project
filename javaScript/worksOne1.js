const tasks = document.getElementById("tasks");
const taskLi = document.getElementById("taskLi");
const taskUn = document.getElementById("unfinishedTasks");
const taskFin = document.getElementById("finishedTasks");
let icon = document.querySelector(".icon");
let done = document.querySelector(".done");
let nav = document.querySelector("nav");
let del = document.querySelector(".delete");
let taskDateDeadLine;
let taskSecondsRemaining = 0;
let l = [], l1 = [];
let m = [], m1 = [];
let h = [], h1 = [];
let total = [];
let total1 = [];
let tD = null;
let vP;

window.onload = function() {
  loadTasksFromLocalStorage();
};

tasks.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTask = createTask();
  
  sortByPriority(newTask);

  taskUn.innerHTML = "";  
  displayTasks(total);  
  saveTasksToLocalStorage(); 
  tasks.reset(); 
}); 

function addEventListenersToTaskButtons() {
  document.querySelectorAll(".icon").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const closestNav = event.target.closest("li").querySelector("nav");
      const closestDiv = event.target.closest("li").querySelector("div");

      if (closestNav) {
        closestNav.classList.toggle("open");
      } else {
        closestDiv.classList.toggle("open");
      }
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
  finishedTaskClick();
}; 

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

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

  task.timerSeconds = 1500; // Reset to 25 minutes
  updateTimerDisplay(task, index);
}

function updateTimerDisplay(task, index) {
  const timerValueElement = document.querySelectorAll(".task-item .value")[index];
  timerValueElement.textContent = formatTime(task.timerSeconds);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secondsLeft = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secondsLeft}`;
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
  taskUn.innerHTML = "";
  displayTasks(total);
  addEventListenersToTaskButtons();
}

function deleteClick() {
  document.querySelectorAll(".delete").forEach((del) => {
    del.addEventListener("click", (event) => {
      const target = event.target;
      if (target.classList.contains("delete")) {
        const index = target.getAttribute("data-index");
        deleteTask(index);
      }
    });
  });
}

function moveFinishedTasks(taskIndex) {
  const task = total[taskIndex];

  if (!task.completed) {
    task.completed = true;
    total1.push(task);
    total = total.filter(t => t.uniqueId !== task.uniqueId);
    total = [...h, ...m, ...l];
    total1 = total1.sort((a, b) => b.secondsRemaining - a.secondsRemaining);

    taskFin.innerHTML = "";  
    taskUn.innerHTML = "";  

    displayTasks(total);
    displayTasks(total1);
    saveTasksToLocalStorage(); 
  }
}

function finishedTaskClick() {
  document.querySelectorAll(".done").forEach((done) => {
    done.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      moveFinishedTasks(index);
      saveTasksToLocalStorage();
      addEventListenersToTaskButtons();
    });
  });
}

function saveTasksToLocalStorage() {
  const allTasks = {
    total: total,
    total1: total1
  };
  localStorage.setItem('tasks', JSON.stringify(allTasks)); 
}

function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks');
  
  if (storedTasks) {
    const parsedTasks = JSON.parse(storedTasks);
    total = parsedTasks.total || [];
    total1 = parsedTasks.total1 || [];

    l = total.filter(task => task.priority === "1");
    m = total.filter(task => task.priority === "2");
    h = total.filter(task => task.priority === "3");

    l1 = total1.filter(task => task.priority === "1");
    m1 = total1.filter(task => task.priority === "2");
    h1 = total1.filter(task => task.priority === "3");

    displayTasks(total);
    displayTasks(total1);
  }
}

function createTask() {
  const currentDate1 = new Date();
  const dateTime = new Date(document.getElementById("taskDeadline").value);
  const taskTD = document.getElementById("taskTimeDeadline").value;
  const taskName = document.getElementById("taskName").value;
  const taskDescription = document.getElementById("taskDescription").value;
  const taskPriority = document.getElementById("taskPriority").value;
  let taskSecondsRemaining = Math.floor((dateTime - currentDate1) / 1000);
  let taskDeadline;
  let vP;

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
    testTD: taskTD !== "",
    deadline: taskDeadline,
    timerSeconds: 1500,
    timerInterval: null,
    completed: false,
    secondsRemaining: taskSecondsRemaining,
    uniqueId: uuidv4()
  };

  return group;
}

function sortByPriority(group) {
  if (group.priority === "1") {
    l.push(group);
    l.sort((a, b) => a.secondsRemaining - b.secondsRemaining);
  } else if (group.priority === "2") {
    m.push(group);
    m.sort((a, b) => a.secondsRemaining - b.secondsRemaining);
  } else {
    h.push(group);
    h.sort((a, b) => a.secondsRemaining - b.secondsRemaining);
  }

  total = [...h, ...m, ...l];
}

function formatTime1(task, seconds) {
  if (task.testTD && task.deadline !== null) {
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
      return `Overdue: ${days} d ${hours} hr ${minutes} min ${remainingSeconds} sec ago`;
    }
  }
}

function displayTasks(group) {
  let taskUl = group === total ? taskUn : taskFin;

  group.forEach((task, i) => {
    const taskElement = document.createElement("li");
    taskElement.classList.add("task-item");
    taskElement.id = task.uniqueId;
    const old_seconds = task.secondsRemaining;
    let color = "";
  
    if(task.deadline !== null){
      const currentDate = new Date();
      const dueDate = new Date(task.deadline);
      const timeDifference = dueDate - currentDate;
      
      console.log(timeDifference);

      if (timeDifference < 0){
          color= `
              <div class="movingArrow"> ---></div>  
              <div id="color" class="red">${formatTime1(task,old_seconds)}</div>
              `;
        }
        else if(timeDifference > 0 && timeDifference <= (24 * 60 * 60 * 1000)){ 
          color= ` <div id="color" class="red">${formatTime1(task,old_seconds)}</div>`;
        }
        else if  (timeDifference > (24 * 60 * 60) && timeDifference < (2 * 24 * 60 * 60 * 1000)){
          color= `<div id="color" class="orange">${formatTime1(task,old_seconds)}</div>`;
        }
        else if  (timeDifference > (2 * 24 * 60 * 60) && timeDifference < (4 * 24 * 60 * 60 * 1000)){
          color= `<div id="color" class="yellow">${formatTime1(task,old_seconds)}</div>`;
        }
        else if ((4 * 24 * 60 * 60 * 1000) < timeDifference){
          color= `<div id="color">${formatTime1(task,old_seconds)}</div>`;
        } 
        else {
          color = `<div id="color">${formatTime1(task,old_seconds)}</div>`;
        } 
      }
    else {
        color= `<div id="color">${formatTime1(task,old_seconds)}</div>`;
    }
    taskElement.innerHTML = `
   <div id="sortedTasks" class="sortedTasks task-item">
        <div class="space">
            <strong>${task.name}</strong>
            <span class="icon">
                <img src="/img/timer.png" alt="dots" class="dots icon">
            </span>
        </div>
        <nav id="open" class="task-nav">
            <span class="icon">
                <img src="/img/close.png" alt="x">
            </span>
            <div id="timerValue">
                <div class="value">
                    ${formatTime(task.timerSeconds)}
                </div>
            </div>
            <button class="start" data-index="${i}">Start</button>
            <button class="rest" data-index="${i}">Rest</button>
            <button class="stop" data-index="${i}">Stop</button>
        </nav>
        <div class="taskDec">${task.description}</div>
        <div class="taskInfo">
           <div class="taskColor"> 
               ${color}
           </div>
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
    taskUl.appendChild(taskElement);
  });
  addEventListenersToTaskButtons();
}
