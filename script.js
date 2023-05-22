const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const taskList = document.getElementById('task-list');

// Add Task
const addTask = (taskText, taskDate) => {
    const task = {
        text: taskText,
        date: taskDate
    };

    fetch('tasks.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
        .then(response => response.text())
        .then(response => {
            console.log(response);
            loadTasksFromJSON();
            updateTaskColors();
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

// Delete Task
const deleteTask = (taskId) => {
    const confirmation = confirm('Are you sure you want to delete this task?');
    if (!confirmation) return;

    fetch('tasks.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: taskId })
    })
        .then(response => response.text())
        .then(response => {
            console.log(response);
            loadTasksFromJSON();
            updateTaskColors();
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

// Edit Task
const editTask = (taskId, taskNameElem, taskDateElem) => {
    const taskName = taskNameElem.textContent;
    const taskDate = taskDateElem.textContent;

    taskNameElem.innerHTML = '';
    taskDateElem.innerHTML = '';

    const taskNameInput = document.createElement('input');
    taskNameInput.type = 'text';
    taskNameInput.value = taskName;
    taskNameElem.appendChild(taskNameInput);

    const taskDateInput = document.createElement('input');
    taskDateInput.type = 'date';
    taskDateInput.value = taskDate;
    taskDateElem.appendChild(taskDateInput);

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.addEventListener('click', () => {
        const updatedTaskName = taskNameInput.value.trim();
        const updatedTaskDate = taskDateInput.value;

        if (updatedTaskName === '' || updatedTaskDate === '') {
            alert('Please enter both task name and deadline date.');
            return;
        }

        updateTask(taskId, updatedTaskName, updatedTaskDate);
    });

    taskDateElem.appendChild(okButton);
};

// Update Task
const updateTask = (taskId, taskName, taskDate) => {
    const task = {
        id: taskId,
        text: taskName,
        date: taskDate
    };

    fetch('tasks.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
        .then(response => response.text())
        .then(response => {
            console.log(response);
            loadTasksFromJSON();
            updateTaskColors();
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

// Load Tasks from JSON
const loadTasksFromJSON = () => {
    fetch('tasks.php')
        .then(response => response.json())
        .then(data => {
            taskList.innerHTML = '';

            data.forEach(task => {
                const taskItem = createTaskItem(task.id, task.text, task.date);
                taskList.appendChild(taskItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

// Create Task Item
const createTaskItem = (taskId, taskText, taskDate) => {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task');

    const taskName = document.createElement('span');
    taskName.classList.add('task-name');
    taskName.textContent = taskText;
    taskItem.appendChild(taskName);

    const taskDateElem = document.createElement('span');
    taskDateElem.classList.add('task-date');
    taskDateElem.textContent = taskDate;
    taskItem.appendChild(taskDateElem);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        editTask(taskId, taskName, taskDateElem);
    });
    taskItem.appendChild(editButton);

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.innerHTML = '&times;';
    deleteIcon.addEventListener('click', () => {
        deleteTask(taskId);
    });
    taskItem.appendChild(deleteIcon);

    const today = new Date();
    const taskDeadlineDate = new Date(taskDate);

    if (taskDeadlineDate < today) {
        taskItem.classList.add('task-overdue');
    } else if (Math.ceil((taskDeadlineDate - today) / (1000 * 60 * 60 * 24)) <= 7) {
        taskItem.classList.add('task-close-deadline');
    } else {
        taskItem.classList.add('task-far-deadline');
    }

    return taskItem;
};

// Submit Task Form
taskForm.addEventListener('submit', event => {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    const taskDate = dateInput.value;

    if (taskText === '' || taskDate === '') {
        alert('Please enter both task name and deadline date.');
        return;
    }

    addTask(taskText, taskDate);

    taskInput.value = '';
    dateInput.value = '';
});

// Update Task Colors
const updateTaskColors = () => {
    const taskItems = document.querySelectorAll('.task');

    taskItems.forEach((taskItem) => {
        const taskDeadline = taskItem.querySelector('.task-date').textContent;
        const today = new Date();
        const taskDeadlineDate = new Date(taskDeadline);

        taskItem.classList.remove('task-overdue', 'task-close-deadline', 'task-far-deadline');

        if (taskDeadlineDate < today) {
            taskItem.classList.add('task-overdue');
        } else if (Math.ceil((taskDeadlineDate - today) / (1000 * 60 * 60 * 24)) <= 7) {
            taskItem.classList.add('task-close-deadline');
        } else {
            taskItem.classList.add('task-far-deadline');
        }
    });
};

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasksFromJSON);
