let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  document.getElementById("theme-switch").addEventListener("change", toggleTheme);
  // Apply saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("theme-switch").checked = true;
  }
});

function addTask() {
  const input = document.getElementById("task-input");
  const dateInput = document.getElementById("due-date");
  const text = input.value.trim();
  const dueDate = dateInput.value;

  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  tasks.push({
    id: Date.now(),
    text,
    completed: false,
    dueDate
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  input.value = "";
  dateInput.value = "";
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "all") return true;
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleComplete(task.id);
    label.appendChild(checkbox);

    const span = document.createElement("span");
    span.textContent = ` ${task.text}`;
    if (task.completed) span.classList.add("completed");

    label.appendChild(span);
    li.appendChild(label);

    if (task.dueDate) {
      const dateSpan = document.createElement("div");
      dateSpan.className = "due-date";
      dateSpan.textContent = `Due: ${task.dueDate}`;
      li.appendChild(dateSpan);
    }

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.onclick = () => deleteTask(task.id);
    li.appendChild(delBtn);

    list.appendChild(li);
  });
}

function toggleComplete(taskId) {
  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
  localStorage.setItem("theme", theme);
}
