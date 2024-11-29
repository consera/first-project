const tasks = document.getElementById("tasks");
const taskLi = document.getElementById("taskLi");
let l = [];
let m = [];
let h = [];
let total = [];
let tD = null;
let vP = 0;
let taskSecondsRemaining = 0;

window.onload = function() {
  loadTasksFromLocalStorage();
};

// عند إضافة مهمة جديدة
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

  if (taskTD) {
    tD = true;
    taskDateDeadLine = String(dateTime.toISOString().split("T")[0]);
    taskDeadline = taskDateDeadLine + " " + document.getElementById("taskTimeDeadline").value + ":00";
  } else {
    taskDeadline = dateTime;
    tD = false;
  }

  // تحديد الأولوية
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

  // إضافة المهمة حسب الأولوية
  if (taskPriority === "1") {
    l.push(group);
  } else if (taskPriority === "2") {
    m.push(group);
  } else {
    h.push(group);
  }

  // ترتيب المهام
  total = [...h, ...m, ...l];
  
  taskLi.innerHTML = ""; // مسح قائمة المهام الحالية
  displayTasks(total);  // عرض المهام من جديد
  saveTasksToLocalStorage();
  tasks.reset();
});

// دالة لعرض المهام
function displayTasks(total) {
  total.forEach((task, i) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task", `task-${task.priority}`);
    
    const old_seconds = task.secondsRemaining;
    let color = "";

    // التحقق من الموعد النهائي للمهمة
    if (task.deadline) {
      const currentDate = new Date();
      const dueDate = new Date(task.deadline);
      const timeDifference = dueDate - currentDate;

      // تحديد اللون حسب الوقت المتبقي
      if (timeDifference < 0) {
        color = `<div id="color" class="red">${formatTime1(task, old_seconds)}</div>`;
      } else if (timeDifference <= (24 * 60 * 60 * 1000)) {
        color = `<div id="color" class="red">${formatTime1(task, old_seconds)}</div>`;
      } else if (timeDifference <= (2 * 24 * 60 * 60 * 1000)) {
        color = `<div id="color" class="orange">${formatTime1(task, old_seconds)}</div>`;
      } else {
        color = `<div id="color">${formatTime1(task, old_seconds)}</div>`;
      }
    }

    taskItem.innerHTML = `
      <div id="sortedTasks" class="sortedTasks task-item">
        <div class="space">
          <strong>${task.name}</strong>
          <span class="icon">
            <img src="/img/timer.png" alt="dots" class="dots">
          </span>
        </div>
        <nav class="task-nav">
          <span class="icon">
            <img src="/img/close.png" alt="x">
          </span>
          <div id="timerValue">
            <div class="value">${formatTime(task.timerSeconds)}</div>
          </div>
          <button class="start" data-index="${i}">Start</button>
          <button class="rest" data-index="${i}">Rest</button>
          <button class="stop" data-index="${i}">Stop</button>
        </nav>
        <div class="taskDec">${task.description}</div>
        <div class="taskInfo">
          <div class="taskColor">${color}</div>
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

    // إضافة أحداث للمؤقتات
    startTimerTask(i);
  });

  addEventListenersToTaskButtons();
}

// تحديث عرض الوقت
function updateTimerDisplay(task, index) {
  const timerValueElement = document.querySelectorAll(".task-item .value")[index];
  if (timerValueElement) {
    timerValueElement.textContent = formatTime(task.timerSeconds);
  }
}

// دالة تشغيل المؤقت للمهمة
function startTimerTask(index) {
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
      const checked = document.querySelectorAll(".task-item")[index].querySelector(".check");
      checked.classList.add("checked");
    }
  }, 1000);
}

// تنسيق الوقت بشكل صحيح (دقائق وثواني)
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secondsLeft = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secondsLeft}`;
}

// تنسيق الوقت للمواعيد النهائية
function formatTime1(task, seconds) {
  if (task.testTD) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const remainingSeconds = seconds % 60;
    return `${days} d ${hours} hr ${minutes} min ${remainingSeconds} sec left`;
  } else {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    return `${days} d ${hours} hr left`;
  }
}

// تشغيل الإنذار عند انتهاء المهمة
function playAlarm() {
  const audio = new Audio("/audio/beeb.wav");
  audio.play();
}

// حفظ المهام في localStorage
function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(total));
}

// تحميل المهام من localStorage
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
