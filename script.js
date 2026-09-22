document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateCounter();
});

const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const themeToggle = document.getElementById('theme-toggle');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');
const taskCounter = document.getElementById('task-counter');

let currentFilter = 'all';

addBtn.addEventListener('click', addTask);
themeToggle.addEventListener('click', toggleTheme);
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        reloadList();
    });
});

function addTask(e) {
    e.preventDefault();
    const text = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const taskObj = {
        id: Date.now(),
        text: text,
        priority: priority,
        completed: false
    };

    saveTaskToLocalStorage(taskObj);
    reloadList();
    taskInput.value = '';
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item ' + (task.completed ? 'completed' : '');
    li.setAttribute('data-id', task.id);

    li.innerHTML = `
        <div class="task-info">
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <span class="badge ${task.priority}">${task.priority}</span>
        </div>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    `;

    taskList.appendChild(li);
}

function toggleTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    reloadList();
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    reloadList();
}

function clearCompletedTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => !task.completed);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    reloadList();
}

function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    taskList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach(task => createTaskElement(task));
    updateCounter();
}

function reloadList() {
    loadTasks();
}

function updateCounter() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const activeTasks = tasks.filter(task => !task.completed);
    taskCounter.innerText = `${activeTasks.length} task${activeTasks.length === 1 ? '' : 's'} remaining`;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.innerText = '☀️ Light Mode';
    } else {
        themeToggle.innerText = '🌙 Dark Mode';
    }
}