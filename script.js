const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Load tasks from localStorage on page load
window.addEventListener('DOMContentLoaded', loadTasks);

// Add task when button is clicked
addBtn.addEventListener('click', addTask);

// Add task when Enter key is pressed
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    // Create task object
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    // Add to DOM
    addTaskToDOM(task);

    // Save to localStorage
    saveTasks();

    // Clear input
    taskInput.value = '';
    taskInput.focus();
}

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.id = 'task-' + task.id;

    li.innerHTML = `
        <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? 'checked' : ''}
        >
        <span class="task-text">${escapeHtml(task.text)}</span>
        <button class="delete-btn">Delete</button>
    `;

    // Add event listeners
    const checkbox = li.querySelector('.task-checkbox');
    const deleteBtn = li.querySelector('.delete-btn');

    checkbox.addEventListener('change', () => {
        toggleTask(task.id);
    });

    deleteBtn.addEventListener('click', () => {
        deleteTask(task.id);
    });

    taskList.appendChild(li);
}

function toggleTask(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        
        const taskElement = document.getElementById('task-' + id);
        taskElement.classList.toggle('completed');
    }
}

function deleteTask(id) {
    const taskElement = document.getElementById('task-' + id);
    taskElement.remove();

    const tasks = getTasks();
    const updatedTasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function getTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
        const checkbox = item.querySelector('.task-checkbox');
        const taskText = item.querySelector('.task-text');
        tasks.push({
            id: parseInt(item.id.replace('task-', '')),
            text: taskText.textContent,
            completed: checkbox.checked
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = getTasks();
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="empty-message">No tasks yet. Add one to get started!</div>';
        return;
    }
    
    taskList.innerHTML = '';
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
