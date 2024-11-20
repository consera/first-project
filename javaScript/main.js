const tasks = document.getElementById("tasks");
let l = []; // Low priority tasks array
let m = []; // Mid priority tasks array
let h = []; // High priority tasks array
let total = []; 
const taskLi = document.getElementById("taskLi");

tasks.addEventListener("submit", (e) => {
    e.preventDefault();
 
    const taskName = document.getElementById("taskName").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const taskPriority = document.getElementById("taskPriority").value;

    console.log("taskName:", taskName);
    console.log("taskDescription:", taskDescription);
   

    const group = {
        name: taskName,
        description: taskDescription,
    };
    
    if (taskPriority === '1') {
        l.push(group);
    } else if (taskPriority === '2') {
        m.push(group);
    } else {
        h.push(group);
    }

    
    total = [...h, ...m, ...l];
    console.log("Total tasks:", total);

    
    taskLi.innerHTML = "";

    total.forEach((task) => {
        const taskElement = document.createElement("li");
        taskElement.classList.add("task", `task-${taskPriority}`);
        
        taskElement.innerHTML = `
            <div class="sortedTasks">
                <strong>${task.name}</strong>
                <span class="icon"><img src="/img/dots.png" alt="dots" class="dots"></span>
                <nav>
                    <span class="close"><img src="/img/close.png" alt="x"></span>
                    <a href="">Set a Timer</a>
                    <a href="">Delete Task</a>
                </nav>
                <div>${task.description}</div>
            </div>
        `;
        
        taskLi.appendChild(taskElement);
    });

    tasks.reset();

    
    let icon= document.querySelector(".icon");
    let nav= document.querySelector("nav");
    let close= document.querySelector(".close");

    icon.onclick = function () {
        nav.classList.add("open");
    };
    close.onclick = function () {
       this.parentElement.classList.remove("open");
    };

});

