document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById("todo-input");
    const addTaskButton = document.getElementById("add-task-btn");
    const todoList = document.getElementById("todo-list");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // FIX: renamed parameter from 'tasks' to 'task' to avoid shadowing outer array
    tasks.forEach((task) => renderTask(task));

    addTaskButton.addEventListener("click", addTask);

    // IMPROVEMENT: allow pressing Enter to add a task
    todoInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addTask();
    });

    function addTask() {
        const taskText = todoInput.value.trim();
        if (taskText === "") return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
        };

        tasks.push(newTask);
        saveTask();
        renderTask(newTask);
        todoInput.value = "";
    }

    function renderTask(task) {
        const li = document.createElement("li");
        li.setAttribute("data-id", task.id);
        if (task.completed) li.classList.add('completed');

        // FIX: was <button>delete</delete> — mismatched closing tag
        li.innerHTML = `
            <span>${task.text}</span>
            <button>Delete</button>
        `;

        li.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            task.completed = !task.completed;
            li.classList.toggle('completed');
            saveTask();
        });

        li.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation(); // prevent toggle from firing
            tasks = tasks.filter(t => t.id !== task.id);
            li.remove();
            saveTask();
        });

        todoList.appendChild(li);
    }

    function saveTask() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});