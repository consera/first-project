const tasks = document.getElementById("tasks");
const taskLi = document.getElementById("taskLi");
const taskUn = document.getElementById("unfinishedTasks");
const taskFin = document.getElementById("finishedTasks");
let icon = document.querySelector(".icon");
let done = document.querySelector(".done");
let uncompleted = document.querySelector(".uncompleted");
let nav = document.querySelector("nav");
let del = document.querySelector(".delete");
let taskDateDeadLine;
let taskDeadline;
let taskSecondsRemaining = 0;
let l = [];
let m = [];
let h = [];
let total = [];
let tD =null;
let vP = 0;
window.onload = function() {
  loadTasksFromLocalStorage();
};
tasks.addEventListener("submit", (e) => {
  e.preventDefault();
  const currentDate1 = new Date();
  const dateTime = new Date(document.getElementById("taskDeadline").value);
  const taskTD = document.getElementById("taskTimeDeadline").value;
  const taskName = document.getElementById("taskName").value;
  const taskDescription = document.getElementById("taskDescription").value;
  const taskPriority = document.getElementById("taskPriority").value;

  
  const timeDifference1 = dateTime - currentDate1;
  taskSecondsRemaining = Math.floor(timeDifference1 / 1000);

  if(taskTD){
    tD= true;
    taskDateDeadLine = String(dateTime.toISOString().split("T")[0]);
    taskDeadline = taskDateDeadLine + " " + document.getElementById("taskTimeDeadline").value + ":00";
  }else{
    taskDeadline= dateTime;
    tD= false;
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
    testTD: tD,
    deadline: taskDeadline,
    timerSeconds: 1500,
    timerInterval: null,
    completed: false,
    secondsRemaining: taskSecondsRemaining
  };

  if (taskPriority === "1") {
    l.push(group);
    l.sort((a, b)=> a.secondsRemaining - b.secondsRemaining);
  } else if (taskPriority === "2") {   
    m.push(group);
    m.sort((a, b)=> a.secondsRemaining - b.secondsRemaining);
  } else {
    h.push(group);
    h.sort((a, b)=> a.secondsRemaining - b.secondsRemaining);
  }

  total = [...h, ...m, ...l];

  taskLi.innerHTML = "";

  displayTasks(total);
  saveTasksToLocalStorage();
  location.reload();
  tasks.reset();
});

function addEventListenersToTaskButtons() {
  document.querySelectorAll(".icon").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      if (event.target.closest("li").querySelector("nav")){
        const nav = event.target.closest("li").querySelector("nav");
        nav.classList.add("open");
      }
    //  else{
    //   const div = event.target.closest("li").querySelector("div");
    //     div.classList.add("open");
    //  }
      // this.classList.add("open");
    });
  });
  document.querySelectorAll(".icon").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      if (event.target.closest("nav")){
        const nav = event.target.closest("nav");
        nav.classList.remove("open");
      }
     else{
      const div = event.target.closest("div");
        div.classList.remove("open");
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

  document.querySelectorAll(".done").forEach((done) => {
    done.addEventListener("click", moveFinishedTask);
  });

  document.querySelectorAll(".uncompleted").forEach((uncompleted) => {
    uncompleted.addEventListener("click", moveFinishedTaskBack);
    // location.reload();
  });

  deleteClick();
  
}; 

function moveFinishedTask(event) {

  const index = event.target.getAttribute("data-index");
  const task = total[index];  
  task.completed= true;
  const d = document.getElementById("container");
  console.log(d);
  d.classList.add("open");
      addEventListenersToTaskButtons(); 
      saveTasksToLocalStorage();
      // console.log(addEventListenersToTaskButtons());
      icon.onclick = function() {
        location.reload();
      }
}

function moveFinishedTaskBack(event) {
  const index = event.target.getAttribute("data-index");
  const task = total[index];
  task.completed= false;
  addEventListenersToTaskButtons(); 
  saveTasksToLocalStorage();
  location.reload();
}

function startTimer(event) {
  const index = event.target.getAttribute("data-index");
  const task = total[index];
  console.log(task);
 
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
    //   task.completed = true;
    //   const checked = event.target.closest("li").querySelector(".check");
    //   console.log(checked);
    //   checked.classList.remove("check");
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

function startTimerTask(index) {
  const task = total[index];
  console.log("task: " + task);

   setInterval(() => {

    updateTimeDeadline(task, index);
  }, 1000);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secondsLeft = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secondsLeft}`;

}

function updateTimeDeadline(task, index) {
  if (task.deadline) { 
    const taskItems = document.querySelectorAll(".task-item #color");

    if (taskItems.length > index && taskItems[index]) {
      const timerValueElement = taskItems[index];

      const currentDate = new Date();
      const dueDate = new Date(task.deadline);
      const timeDifference = dueDate - currentDate;
      const taskSecondsRemaining = Math.floor(timeDifference / 1000);

      if (taskSecondsRemaining >= 0) {
        task.secondsRemaining = taskSecondsRemaining;
        timerValueElement.textContent = formatTime1(task, task.secondsRemaining);  
      } else {
        task.secondsRemaining = taskSecondsRemaining;
        timerValueElement.textContent = formatTime1(task, task.secondsRemaining); 
      }
      console.log(task.deadline);
    } else {
      console.error("there is no index", index);
    }
  } else {
    formatTime1(task, task.secondsRemaining);
    // console.log(task.deadline);
  }
  
}


// function updateTimeDeadline(task, index) {
//   if(task.deadline !== null && task.deadline !== ""){
//       const timerValueElement = document.querySelectorAll(".task-item #color")[index];
//       const currentDate1 = new Date();
//       const dueDate1 = new Date(task.deadline);
//       const timeDifference1 = dueDate1 - currentDate1;
//       const taskSecondsRemaining = Math.floor(timeDifference1 / 1000);

//       task.secondsRemaining = taskSecondsRemaining;
//       timerValueElement.textContent = formatTime1(task ,task.secondsRemaining);
//       console.log(timerValueElement.textContent);
//     }
//     else{
    
//     formatTime1(task ,task.secondsRemaining);
//       // console.log(timerValueElement);
//     }
//   }

function formatTime1( task , seconds) {
    if(task.testTD === true && task.deadline !== null){
      if(seconds >= 0){
        const days = Math.floor(seconds / (24 * 60 * 60)); 
        const hours = Math.floor((seconds % (24 * 60 * 60)/ (60 * 60) )); 
        const minutes = Math.floor((seconds % (60 * 60) ) / 60); 
        const remainingSeconds = seconds % 60; // remaining seconds
        return `${days} d ${hours} hr ${minutes} min ${remainingSeconds} sec left`;
      }
      else{
        const pSec= -seconds;
        const days = Math.floor(pSec / (24 * 60 * 60)); 
        const hours = Math.floor((pSec % (24 * 60 * 60)/ (60 * 60) )); 
        const minutes = Math.floor((pSec % (60 * 60) ) / 60); 
        const remainingSeconds = pSec % 60; // remaining seconds
        return `Over due: ${days} d ${hours} hr ${minutes} min ${remainingSeconds} sec had gone`;
      }
    }
    else if (task.deadline !== null){
      if(seconds >= 0){
        const days = Math.floor(seconds / (24 * 60 * 60)); 
        const hours = Math.floor((seconds % (24 * 60 * 60)/ (60 * 60) )); 
        return `${days} d ${hours} hr left`;
      }
      else{
        const pSec= -seconds;
        const days = Math.floor(pSec / (24 * 60 * 60)); 
        const hours = Math.floor((pSec % (24 * 60 * 60)/ (60 * 60) )); 
        return `Over due: ${days} d ${hours} hr had gone`;
      }
    }
    else if(task.deadline === null){
      return `There no Deadline for this Task`;
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
  addEventListenersToTaskButtons();
};

function deleteClick() {
  document.querySelectorAll(".delete").forEach((del) => {
      del.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("delete")) {
          const index = target.getAttribute("data-index");
          deleteTask(index);

       
           }
          location.reload();
      });
  });
};

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

    total = [...h, ...m, ...l];
    displayTasks(total);
  }
}

function displayTasks(total) {
  total.forEach((task, i) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task", `task-${task.priority}`);
    
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

    taskItem.innerHTML = `
    <div id="sortedTasks" class="sortedTasks task-item">
        <div class="space">
            <strong>${task.name}</strong>
            <span class="icon">
                <i class="fa-solid fa-hourglass-half"></i>
            </span>
        </div>
        <nav id="open" class="task-nav">
            <span class="icon">
                <i class="fa-solid fa-x"></i>
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
       <div class="status">
            <div>Status : </div>
            <i class="fa-solid fa-check"></i>
          </div>
        <div class="space">
             <button class="delete" data-index="${i}">Delete</button>
            <button class="done" data-index="${i}">Done</button>
            <button class="uncompleted" data-index="${i}">Uncompleted</button>
        </div>
    </div>
                    `;
  
    if (task.completed === true){
      taskFin.appendChild(taskItem);
    }else{
      taskUn.appendChild(taskItem);
    }
    startTimerTask(i);
  });
  addEventListenersToTaskButtons();
  
};
