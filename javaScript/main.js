const tasks= document.getElementById("tasks"); 
let x = 0, y = 0, z = 0;
 let l = [];
 let m = [];
 let h = [];
 let total =[];
const taskLi= document.getElementById("taskLi")
tasks.addEventListener("submit" ,  (e) => {
    e.preventDefault();
    console.clear();
        const taskName = document.getElementById("taskName").value;
        const  taskDescription= document.getElementById("taskDescription").value;
        const taskPriority = document.getElementById("taskPriority").value;
            if (taskPriority === "Low") {
                l.push(taskName);
                l.push(taskDescription);
            } else if (taskPriority === "Mid") {
                m.push(taskName);
                m.push(taskDescription);
            } else {
                h.push(taskName);
                h.push(taskDescription );
            }

         for(i=0; i< h.length; i=i+2){

         
        const task = document.createElement("li");
        task.classList.add("task" , `task-${taskPriority}`);
        task.innerHTML= `
            <div>
                <strong>${h[i]}</strong>
                <div>${h[i+1]}</div>
            </div>
            `;
            taskLi.appendChild(task);
            tasks.reset();}
            for(i=0; i< m.length; i=i+2){

         
                const task = document.createElement("li");
                task.classList.add("task" , `task-${taskPriority}`);
                task.innerHTML= `
                    <div>
                        <strong>${m[i]}</strong>
                        <div>${m[i+1]}</div>
                    </div>
                    `;
        
                    taskLi.appendChild(task);
                    tasks.reset();}

                   for(i=0; i< l.length; i=i+2){

         
        const task = document.createElement("li");
        task.classList.add("task" , `task-${taskPriority}`);
        task.innerHTML= `
            <div>
                <strong>${l[i]}</strong>
                <div>${l[i+1]}</div>
            </div>
            `;

            taskLi.appendChild(task);
            tasks.reset();}
});
    
