const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskLists = document.querySelectorAll(".task-list");

// LocalStorage එකට Save කිරීම
function saveTasks() {
    const tasks = [];
    
    document.querySelectorAll(".task-item").forEach((task) => {
        tasks.push({
            id: task.dataset.id,
            text: task.querySelector("span").textContent,
            status: task.closest(".column").dataset.status
        });
    });

    localStorage.setItem("KanbanTasks", JSON.stringify(tasks));
}

// LocalStorage එකෙන් Load කිරීම
function loadTasks() {
    const saved = localStorage.getItem("KanbanTasks");
    if (saved) {
        JSON.parse(saved).forEach(({ id, text, status }) => {
            const task = createTaskElement(text, id);
            const targetColumn = document.getElementById(status);
            if (targetColumn) {
                targetColumn.appendChild(task);
            }
        });
    }
}

// Task එක නිර්මාණය කිරීම (Delete Button එක සහිතව)
function createTaskElement(text, id = Date.now().toString()) {
    const task = document.createElement("div");
    task.className = "task-item"; 
    task.dataset.id = id;        
    task.id = id;                
    task.draggable = true;

    const taskText = document.createElement("span");
    taskText.textContent = text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.className = "delete-btn";
    
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        task.remove();
        saveTasks();
    });

    task.appendChild(taskText);
    task.appendChild(deleteBtn);

    task.addEventListener("dragstart", (e) => {
        task.classList.add("dragging");
        e.dataTransfer.setData("text/plain", task.id);
    });

    task.addEventListener("dragend", () => {
        task.classList.remove("dragging");
    });

    return task;
}

// Form Submit
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = createTaskElement(taskText);
        document.getElementById("todo").appendChild(task);
        taskInput.value = "";
        saveTasks();
    }
});

// Drag and Drop Events
taskLists.forEach((list) => {
    list.addEventListener("dragover", (e) => {
        e.preventDefault(); 
        list.classList.add("drag-over");
    });

    list.addEventListener("dragleave", () => {
        list.classList.remove("drag-over");
    });

    list.addEventListener("drop", (e) => {
        e.preventDefault();
        list.classList.remove("drag-over");
        const taskId = e.dataTransfer.getData("text/plain");
        const draggedTask = document.getElementById(taskId);
        if (draggedTask) {
            list.appendChild(draggedTask);
            saveTasks();
        }
    });
});

loadTasks();