const tasks = document.getElementById("tasks");
let l = [];
let m = [];
let h = [];
let total = [];
let icon = document.querySelector(".icon");
  let nav = document.querySelector("nav");
  // let close = document.querySelector(".close");
  let del = document.querySelector(".delete");
const taskLi = document.getElementById("taskLi");
let tD =null;
let vP = 0;
window.onload = function() {
  loadTasksFromLocalStorage();
};

tasks.addEventListener("submit", (e) => {
  e.preventDefault();
  const dateTime = new Date(document.getElementById("taskDeadline").value);
  const taskTD = document.getElementById("taskTimeDeadline").value;
  const taskName = document.getElementById("taskName").value;
  const taskDescription = document.getElementById("taskDescription").value;
  const taskPriority = document.getElementById("taskPriority").value;
  let taskDateDeadLine;
  let taskDeadline;
  let taskSecondsRemaining = 0;
  console.log(vP);
  const currentDate1 = new Date();
  const dueDate1 = new Date(taskDeadline);
  const timeDifference1 = dueDate1 - currentDate1;
  taskSecondsRemaining = Math.floor(timeDifference1 / 1000);
  console.log(taskTD);
  if(taskTD){
    tD= true;
    taskDateDeadLine = String(dateTime.toISOString().split("T")[0]);
    taskDeadline = taskDateDeadLine + " " + document.getElementById("taskTimeDeadline").value + ":00";
    const dueDate1 = new Date(taskDeadline);
    const timeDifference1 = dueDate1 - currentDate1;
    taskSecondsRemaining = Math.floor(timeDifference1 / 1000);
  }else{
    taskDeadline= dateTime;
    tD= false;
  }
  
  console.log(taskDeadline);
  if (taskPriority === "1") {
    vP = "Low";
  } else if (taskPriority === "2") {   
    vP = "Med";
  } else {
    vP = "High";
  }
 
  // const minRemaining1 = Math.floor(timeDifference1 /(1000 *60 ));
  // const mins1 =  Math.floor(minRemaining1 % 60 );
  console.log(timeDifference1);
  // console.log(mins1);
  const group = {
    name: taskName,
    description: taskDescription,
    priority: taskPriority,
    valuePriority: vP,
    testTD: tD,
    deadline: taskDeadline,
    timerSeconds: 1500,
    // timeDiff : timeDifference1,
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
  tasks.reset();
});
function addEventListenersToTaskButtons() {
  document.querySelectorAll(".icon").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const nav = event.target.closest("li").querySelector("nav");
      nav.classList.add("open");
    });
  });
  document.querySelectorAll(".icon").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const nav = event.target.closest("nav");
      nav.classList.remove("open");
    });
  });
  icon.onclick = function () {
    this.parentElement.classList.add("open");
  };
  icon.onclick = function () {
    this.parentElement.classList.remove("open");
  };
  
  // document.querySelectorAll(".close").forEach((close) => {
  //   close.addEventListener("click", (event) => {
  //     const div = event.target.closest("div");
  //     div.classList.remove("open");
  //   });
  // });
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
}; 
  
 

  // Timer controls logic
  function startTimer(event) {
    const index = event.target.getAttribute("data-index");
    const task = total[index];
    console.log(task);
   
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
        console.log(checked);
        checked.classList.remove("check");
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
  function startTimerTask(total, index) {
    const task = total[index];
    console.log("task: " + task);
  
     setInterval(() => {


      updateTimeDeadline(task, index);
      // console.log(task);
      
    }, 1000);
  }
  function updateTimeDeadline(task, index) {
if(task.deadline !== null){
      const timerValueElement = document.querySelectorAll(".task-item #color")[index];
      console.log(task.secondsRemaining);
      console.log("bla: " + task.deadline)
      const currentDate1 = new Date();
      const dueDate1 = new Date(task.deadline);
      const timeDifference1 = dueDate1 - currentDate1;
      const taskSecondsRemaining = Math.floor(timeDifference1 / 1000);
      console.log(taskSecondsRemaining)
      task.secondsRemaining = taskSecondsRemaining
      timerValueElement.textContent = formatTime1(task,task.secondsRemaining);
    }
  }
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secondsLeft = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secondsLeft}`;

  }
  function formatTime1( task , seconds) {
    if(task.testTD === true){
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
    else{
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
 
  }
  

  function playAlarm() {
    const audio = new Audio("/audio/beeb.wav");
    audio.play();
  }
 
  function deleteTask(index) {
    const task = total[index];

    // إزالة المهمة من القائمة الخاصة بها
    if (task.priority === "1") {
      l.splice(index, 1);
    } else if (task.priority === "2") {
      m.splice(index, 1);
    } else {
      h.splice(index, 1);
    }
    // تحديث القائمة بالكامل
    total = [...h, ...m, ...l];
    // tasks.reset();
    // total.splice(index, 1);
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
            //const div = event.target.closest("li").querySelectorAll("#container");
            const d = document.getElementById("container");
            console.log(d);
            d.classList.add("open");
            addEventListenersToTaskButtons();
          }
        });
      });
  };
  function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(total));
  }
  function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    
    if (storedTasks) {
      // تحويل النص المسترجع إلى مصفوفة باستخدام JSON.parse()
      total = JSON.parse(storedTasks);
      l = total.filter(task => task.priority === "1");
      m = total.filter(task => task.priority === "2");
      h = total.filter(task => task.priority === "3");  
      displayTasks(total);
    }
  }
  
  function displayTasks(total) {
    for (i = 0; i < total.length; i++) {
        const task = total[i];
        let color ="";
      const old_seconds = task.secondsRemaining;
      const currentDate = new Date();
      const dueDate = new Date(task.deadline);
      const timeDifference = dueDate - currentDate;
      console.log("timediff: " + timeDifference);
      const hoursRemaining = Math.floor(timeDifference /(1000 *60 * 60));
      // const minRemaining = Math.floor(timeDifference /(1000 *60 ));
      // const mins =  Math.floor(minRemaining % 60 );
      // console.log(hoursRemaining);
      // const days = Math.floor(hoursRemaining/24);
      // const hours = Math.floor(hoursRemaining%24);
      
      // const secs =   Math.floor(hours/(60 * 60));
      // totalHours.push(hoursRemaining);
      if(task.deadline){
        const currentDate = new Date();
      const dueDate = new Date(task.deadline);
      const timeDifference = dueDate - currentDate;
      const hoursRemaining = Math.floor(timeDifference / (1000 * 60 * 60));
      
      if (hoursRemaining < 0){
        color= `
            <div class="movingArrow"> ---></div>  
            <div id="color" class="red">${formatTime1(task,old_seconds)}</div>
            `;
      }
      else if(hoursRemaining > 0 && hoursRemaining <= 24){
        
      color= `
      <div id="color" class="red">${formatTime1(task,old_seconds)}</div>`;
        // color = "red";
        // console.log(color);
      }
      else if  (hoursRemaining > 24 && hoursRemaining < 48){
        color= `<div id="color" class="orange">${formatTime1(task,old_seconds)}</div>`;
        // color = "yellow";
        // console.log(color);
      }
      else if  (hoursRemaining > 48 && hoursRemaining < 96){
        color= `<div id="color" class="yellow">${formatTime1(task,old_seconds)}</div>`;
        // color = "yellow";
        // console.log(color);
      }
      else if (96 < hoursRemaining){
        color= `<div id="color">${formatTime1(task,old_seconds)}</div>`;
      } 
      else {
        color= ``;
      } }
      else {
        color= ``;
      }
     console.log(hoursRemaining);
        const taskItem = document.createElement("li");
        console.log(task);
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
        taskLi.appendChild(taskItem);
        startTimerTask(total, i);
      };
      addEventListenersToTaskButtons();
      
};



/*

/*const timerValue= document.querySelector(".timerValue");
  const value= document.querySelector(".timerValue .value");
  const audio= new Audio('beeb.wav');
  let p;
  const timerSeconds= 1500;
  let mutifac= 360/timerSeconds;

  function fNumInStrMin(number){
    const minutes= Math.trunc(number/60).toString.padStart(2, '0');
    const secondes= Math.trunc(number%60).toString.padStart(2, '0');

    return `${minutes} : ${secondes}` ;
  }
  const startTimer = () => {
        p = setInterval(() => {timerSeconds --; setInfo() }, 1000);
  }

  const stopTimer = () => clearInterval(p);
  function setInfo(){
    if (timerSeconds === 0) {
        stopTimer();
        audio.play();
    }
    value.textContent = `${fNumInStrMin(timerSeconds)}`;
    timerValue.style.background= `linear-gradient(${timerSeconds * mutifac} 360deg var(--text-color) 0deg)`;
  }
});
/* <a href="">Delete Task</a>   <div><a href="">Start Timer</a></div>  <nav>
                <span class="close"><img src="/img/close.png" alt="x"></span>
                <a href="">Set a Timer</a>
                
                     </nav>  */
/* if (taskPriority === 1) {
        l.push(taskName);
        l.push(taskDescription);
    } else if (taskPriority === 2) {
        m.push(taskName);
        m.push(taskDescription);
    } else {
        h.push(taskName);
        h.push(taskDescription );
    }*/
