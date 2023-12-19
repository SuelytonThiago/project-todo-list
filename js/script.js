const editTaskContainer = document.querySelector("#edit-task-container");
const taskListContainer = document.querySelector("#task-list-container");
const addTaskContainer = document.querySelector("#add-task-container");
const cancelEditTaskBtn = document.querySelector("#cancel-edit-task");
const taskEditor = document.querySelector("#task-editor");
const taskEditorInput = document.querySelector("#edit");
const createTaskInput = document.querySelector("#task");
const searchBarInput = document.querySelector("#search");
const clearBtn = document.querySelector("#clean-btn");
const selectFilter = document.querySelector("#select-filter");

let oldInputTaskTitle;

const filterTasks = (filterValue) =>{
    const tasks = document.querySelectorAll(".show-task");

    switch(filterValue) {
        case "all":
            tasks.forEach((task) => task.style.display = "flex")
            break
        case "done":
            tasks.forEach((task) => task.classList.contains("finished") 
            ? task.style.display = "flex"
            : task.style.display = "none")
            break
        case "todo":
            tasks.forEach((task) => task.classList.contains("finished") 
            ? task.style.display = "none"
            : task.style.display = "flex")
            break
    }
}

const getSearchTasks = (search) => {
    const tasks = document.querySelectorAll(".show-task");
    
    tasks.forEach((task) =>{
        let title = task.querySelector(".task-description").innerText.toLowerCase();

        const searchVar = search.toLowerCase();

        task.style.display = "flex";

        if(!title.includes(searchVar)){
            task.style.display = "none";
        }
       
    });
};

const saveTask = (text, done = 0, save = 1) => {
    const task = document.createElement("div");
    task.classList.add("show-task");
    
    const title = document.createElement("p");
    title.classList.add("task-description");
    title.innerText = text;
    task.appendChild(title);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("done-task");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    task.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-task");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    task.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-task");
    deleteBtn.innerHTML = '<i class="fa-solid fa-x"></i>';
    task.appendChild(deleteBtn);

    if(done){
        task.classList.add("finished");
    }

    if(save){
        saveTodoLocalStorage({text, done});
    }

    taskListContainer.appendChild(task);
    createTaskInput.value = "";
    createTaskInput.focus();
}

addTaskContainer.addEventListener("submit", (e) => {
    e.preventDefault();

    const taskValue = createTaskInput.value;

    if(taskValue){
        saveTask(taskValue);
    }
})

const updateTaskTitle = (text) => {
    const tasks = document.querySelectorAll(".show-task");
    tasks.forEach((task) =>{
        let title = task.querySelector(".task-description");
        if(title.innerText === oldInputTaskTitle) {
            title.innerText = text;

            updateTaskLocalStorage(oldInputTaskTitle, text);
        }
    });
}

const toggleForms = function(){
    addTaskContainer.classList.toggle("hide");
    taskListContainer.classList.toggle("hide");
    editTaskContainer.classList.toggle("hide");
}

document.addEventListener("click", (e) =>{
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let taskTitle;

    if(parentEl && parentEl.querySelector(".task-description")){
        taskTitle = parentEl.querySelector(".task-description").innerText;
    }

    if(targetEl.classList.contains("delete-task")){
        parentEl.remove();
        RemoveTaskLocalStorage(taskTitle);
    }

    if(targetEl.classList.contains("done-task")){
        parentEl.classList.toggle("finished");
        updateTaskStatusLocalStorage(taskTitle);
    }

    if(targetEl.classList.contains("edit-task")){
        toggleForms();
        taskEditorInput.value = taskTitle;
        oldInputTaskTitle = taskTitle;
    }
});

cancelEditTaskBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    toggleForms();
});

taskEditor.addEventListener("submit", (e) =>{
    e.preventDefault();
    const editInputValue = taskEditorInput.value;
    if(editInputValue){
        updateTaskTitle(editInputValue);
    }
    toggleForms();
});

searchBarInput.addEventListener("keyup", (e)=>{
    const search = e.target.value;

    getSearchTasks(search);
});

clearBtn.addEventListener("click", (e) =>{
    e.preventDefault();

    searchBarInput.value = "";

    searchBarInput.dispatchEvent(new Event("keyup"));
});

selectFilter.addEventListener("change", (e) =>{
    const filterValue = e.target.value;

    filterTasks(filterValue);
})

//local storage

const getTaskLocalStorage = () =>{
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return tasks;
}

const loadTasks = () =>{
    const tasks = getTaskLocalStorage();

    tasks.forEach((task) => {
        saveTask(task.text, task.done, 0)
    });
}

const RemoveTaskLocalStorage = (taskText) => {
    const tasks = getTaskLocalStorage();

    const filteredTasks = tasks.filter((task) => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
}

const saveTodoLocalStorage = (task) =>{
    const tasks = getTaskLocalStorage();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const updateTaskStatusLocalStorage = (taskText) => {
    const tasks = getTaskLocalStorage();
    tasks.map((task) => task.text === taskText ? task.done = !task.done : null);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const updateTaskLocalStorage = (taskOldText, taskNewText) => {
    const tasks = getTaskLocalStorage();
    tasks.map((task) => task.text === taskOldText ? task.text = taskNewText : null);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

loadTasks();
