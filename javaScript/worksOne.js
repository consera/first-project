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

  const group = {
    name: taskName,
    description: taskDescription,
    priority: taskPriority,
    timerSeconds: 2,
    timerInterval: null,
  };

  if (taskPriority === "1") {
    l.push(group);
  } else if (taskPriority === "2") {
    m.push(group);
  } else {
    h.push(group);
  }

  total = [...h, ...m, ...l];

  taskLi.innerHTML = "";

  for (i = 0; i < total.length; i++) {
    const task = total[i];
    const taskItem = document.createElement("li");
    console.log(task);
    taskItem.classList.add("task", `task-${task.Priority}`);
    taskItem.innerHTML = `
                 <div id= "sortedTasks" class= "sortedTasks task-item">
                    <strong>${task.name}</strong>
                    <span class="icon">
                         <img src="/img/timer.png" alt="dots"  class= "dots" >
                    </span>
                    <nav id="open" class="task-nav">
                        <span class="close">
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

                    <div>${task.description}</div>
                       <button class="delete" data-index="${i}">Delete</button>
                   
                </div>
                     
                `;
    taskLi.appendChild(taskItem);
  } //<img src="/img/check.png" alt="check" class="check"  >
  tasks.reset();

  let icon = document.querySelector(".icon");
  let nav = document.querySelector("nav");
  let close = document.querySelector(".close");
  let del = document.querySelector(".delete");
  icon.onclick = function () {
    nav.classList.add("open");
  };
  close.onclick = function () {
    this.parentElement.classList.remove("open");
  };

  document.querySelectorAll(".start").forEach((button) => {
    button.addEventListener("click", startTimer);
  });

  document.querySelectorAll(".stop").forEach((button) => {
    button.addEventListener("click", stopTimer);
  });

  document.querySelectorAll(".rest").forEach((button) => {
    button.addEventListener("click", restTimer);
  });

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
        const checked = document.getElementsByClassName("check");
        console.log(checked);
        checked.classList.add("checked");  
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
  }

  function restTimer(event) {
    const index = event.target.getAttribute("data-index");
    const task = total[index];

    task.timerSeconds = 1500; // Reset to 25 minutes
    updateTimerDisplay(task, index);
  }

  function updateTimerDisplay(task, index) {
    const timerValueElement =
      document.querySelectorAll(".task-item .value")[index];
    timerValueElement.textContent = formatTime(task.timerSeconds);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secondsLeft = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secondsLeft}`;
  }

  function playAlarm() {
    const audio = new Audio("/audio/beeb.wav");
    audio.play();
  }
  document.querySelectorAll(".icon").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const nav = event.target.closest("li").querySelector("nav");
      nav.classList.add("open");
    });
  });
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
      }
    });
  });
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
    taskLi.innerHTML = "";
    for (i = 0; i < total.length; i++) {
      const task = total[i];
      const taskItem = document.createElement("li");
      console.log(task);
      taskItem.classList.add("task", `task-${task.Priority}`);
      taskItem.innerHTML = `
                    <div id= "sortedTasks" class= "sortedTasks task-item">
                            <strong>${task.name}</strong>
                            <span class="icon">
                                    <img src="/img/timer.png" alt="dots"  class= "dots" >
                                </span>
                            <nav id="open" class="task-nav">
                                    <span class="close">
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
        
                            <div>${task.description}</div>
                            <button class="delete" data-index="${i}">Delete</button>
  
                    </div>

                        
                    `;
      taskLi.appendChild(taskItem);
    }
  }

  document.querySelectorAll(".close").forEach((close) => {
    close.addEventListener("click", (event) => {
      const nav = event.target.closest("nav");
      nav.classList.remove("open");
    });
  });

  document.querySelectorAll(".close").forEach((close) => {
    close.addEventListener("click", (event) => {
      const div = event.target.closest("div");
      div.classList.remove("open");
    });
  });
}); /*

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
