// ===== ADD TASK =====
async function addTask() {
    const input = document.getElementById("taskInput");
    if (!input) return;

    const task = input.value.trim();
    if (!task) return;

    try {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task, status: "pending" })
        });

        input.value = '';
        loadTasks();

    } catch (err) {
        console.error("Error adding task:", err);
    }
}

// ===== LOAD TASKS =====
async function loadTasks() {
    try {
        const res = await fetch('/api/tasks');
        const data = await res.json();

        const list = document.getElementById("taskList");
        if (!list) return;

        list.innerHTML = '';

        data.forEach((taskObj, index) => {

            const li = document.createElement("li");

            if (taskObj.status === "completed") {
                li.classList.add("completed");
            }

            const span = document.createElement("span");
            span.textContent = taskObj.task;

            const actions = document.createElement("div");
            actions.className = "task-actions";

            const toggleBtn = document.createElement("button");
            toggleBtn.textContent = taskObj.status === "pending" ? "Done" : "Undo";
            toggleBtn.onclick = () => toggleStatus(index);

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.onclick = () => editTask(index, taskObj.task);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = () => deleteTask(index);

            actions.appendChild(toggleBtn);
            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);

            li.appendChild(span);
            li.appendChild(actions);
            list.appendChild(li);
        });

    } catch (err) {
        console.error("Error loading tasks:", err);
    }
}

// ===== TOGGLE STATUS =====
async function toggleStatus(index) {
    try {
        await fetch(`/api/tasks/${index}`, { method: 'PUT' });
        loadTasks();
    } catch (err) {
        console.error("Error updating status:", err);
    }
}

// ===== DELETE TASK =====
async function deleteTask(index) {
    try {
        await fetch(`/api/tasks/${index}`, { method: 'DELETE' });
        loadTasks();
    } catch (err) {
        console.error("Error deleting task:", err);
    }
}

// ===== EDIT TASK =====
async function editTask(index, oldText) {
    const newTask = prompt("Edit task:", oldText);
    if (!newTask || newTask.trim() === '') return;

    try {
        await fetch(`/api/tasks/${index}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: newTask.trim() })
        });
        loadTasks();
    } catch (err) {
        console.error("Error editing task:", err);
    }
}

// ===== AUTO LOAD TASKS =====
if (window.location.pathname === '/tasks') {
    loadTasks();
}