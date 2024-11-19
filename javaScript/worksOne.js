const tasks = document.getElementById("tasks");
let l = []; // Low priority tasks array
let m = []; // Mid priority tasks array
let h = []; // High priority tasks array
let total =[];
let test =true;
const taskLi = document.getElementById("taskLi");

tasks.addEventListener("submit", (e) => {
    e.preventDefault();
 
    const taskName = document.getElementById("taskName").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const taskPriority = document.getElementById("taskPriority").value;

 
    if (taskPriority === 1) {
        l.push(taskName);
        l.push(taskDescription);
    } else if (taskPriority === 2) {
        m.push(taskName);
        m.push(taskDescription);
    } else {
        h.push(taskName);
        h.push(taskDescription );
    }
    total = [...h, ...m, ...l]; 
if(test === true){
    for(i=0; i< total.length; i=i+2){

         
        const task = document.createElement("li");
        task.classList.add("task" , `task-${taskPriority}`);
        task.innerHTML= `
            <div id= "sortedTasks" class= "sortedTasks">
                <strong>${total[i]}</strong>
                <div>${total[i+1]}</div>
            </div>
            `;
            taskLi.appendChild(task);
            tasks.reset();}
        test= false;
    }else {
        taskLi.innerHTML = "";
        let tasks1 = total.sort()
        for(i=0; i< total.length; i=i+2){

         
            const task = document.createElement("li");
            task.classList.add("task" , `task-${taskPriority}`);
            task.innerHTML= `
                <div id= "sortedTasks" class= "sortedTasks">
                    <strong>${total[i]}</strong>
                    <div>${total[i+1]}</div>
                </div>
                `;
                taskLi.appendChild(task);
                tasks.reset();
            };
            test= false;
    }

});
