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
      timerSeconds: 1500,
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
    displayTasks();
  
    tasks.reset();
  });
  
  function displayTasks() {
    total.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("task", `task-${task.priority}`);
      taskItem.innerHTML = `
        <div class="sortedTasks task-item">
          <strong>${task.name}</strong>
          <span class="icon">
            <img src="/img/timer.png" alt="dots" class="dots">
          </span>
          <nav class="task-nav">
            <span class="close"><img src="/img/close.png" alt="x"></span>
            <div id="timerValue">
              <div class="value">${formatTime(task.timerSeconds)}</div>
            </div>
            <button class="start" data-index="${index}">Start</button>
            <button class="rest" data-index="${index}">Rest</button>
            <button class="stop" data-index="${index}">Stop</button>
          </nav>
          <div>${task.description}</div>
          <button class="delete" data-index="${index}">Delete</button>
          <img src="/img/check.png" alt="check" class="check">
        </div>
      `;
      taskLi.appendChild(taskItem);
    });
  }
  
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secondsLeft = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secondsLeft}`;
  }
  
  function startTimer(index) {
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
  
  function stopTimer(index) {
    const task = total[index];
    clearInterval(task.timerInterval);
    task.timerInterval = null;
    updateTimerDisplay(task, index);
  }
  
  function restTimer(index) {
    const task = total[index];
    task.timerSeconds = 1500; // إعادة ضبط الوقت إلى 25 دقيقة
    updateTimerDisplay(task, index);
  }
  
  function updateTimerDisplay(task, index) {
    const timerValueElement = document.querySelectorAll(".task-item .value")[index];
    timerValueElement.textContent = formatTime(task.timerSeconds);
  }
  
  function playAlarm() {
    const audio = new Audio("/audio/beeb.wav");
    audio.play();
  }
  
  taskLi.addEventListener("click", (event) => {
    const target = event.target;
    
    if (target.classList.contains("start")) {
      const index = target.getAttribute("data-index");
      startTimer(index);
    } else if (target.classList.contains("stop")) {
      const index = target.getAttribute("data-index");
      stopTimer(index);
    } else if (target.classList.contains("rest")) {
      const index = target.getAttribute("data-index");
      restTimer(index);
    } else if (target.classList.contains("delete")) {
      const index = target.getAttribute("data-index");
      deleteTask(index);
    } else if (target.classList.contains("close")) {
      target.closest("nav").classList.remove("open");
    } else if (target.classList.contains("icon")) {
      target.closest("li").querySelector("nav").classList.add("open");
    }
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
    displayTasks();
  }
  