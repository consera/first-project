const tasks = document.getElementById("tasks");
let l = [];
let m = [];
let h = [];
let total = [];
let timer1= document.getElementById("timer1").value;
let timer2= document.getElementById("timer2").value;
const taskLi = document.getElementById("taskLi");

tasks.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const taskDescription = document.getElementById("taskDescription").value;
  const taskPriority = document.getElementById("taskPriority").value;

  /*
    if (taskPriority === 1) {
        l.push(taskName);
        l.push(taskDescription);
    } else if (taskPriority === 2) {
        m.push(taskName);
        m.push(taskDescription);
    } else {
        h.push(taskName);
        h.push(taskDescription );
    }*/
  console.log("taskName:", taskName);
  console.log("taskDescription:", taskDescription);

  const group = {
    name: taskName,
    description: taskDescription,
    timerStarted: false,
    timerTime: 0,
  };

  if (taskPriority === "1") {
    l.push(group);
  } else if (taskPriority === "2") {
    m.push(group);
  } else {
    h.push(group);
  }

  total = [...h, ...m, ...l];
  console.log("Total tasks:", total);

    taskLi.innerHTML = "";
    let tasks1 = total.sort();
    for (i = 0; i < total.length; i = i +1) {
      const task = document.createElement("li");
      task.classList.add("task", `task-${taskPriority}`);
      task.innerHTML = `
                <div id= "sortedTasks" class= "sortedTasks">
                    <strong>${total[i].name}</strong>
                     <span class="icon"><img src="/img/dots.png" alt="dots"  class= "dots" ></span>
                   <nav>
                <span class="close"><img src="/img/close.png" alt="x"></span>
                <a href="">Set a Timer</a>
                
            </nav>  
                
                    <div>${total[i].description}</div>
                </div>
                <div><a href="">Start Timer</a></div>
                `;
      taskLi.appendChild(task);
      tasks.reset();
    }
   

  let icon = document.querySelector(".icon");
  let nav = document.querySelector("nav");
  let close = document.querySelector(".close");

  icon.onclick = function () {
    nav.classList.add("open");
  };
  close.onclick = function () {
    this.parentElement.classList.remove("open");
  };

});
/* <a href="">Delete Task</a> */