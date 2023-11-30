const addButton = document.getElementById('addTaskButton');
const taskInput = document.getElementById('taskInput');
const tasksContainer = document.getElementById('tasksContainer');
const completedTasksContainer = document.getElementById('completedTasks');
const emptyState = document.getElementById('emptyState');

function createEditableTask(taskText) {
  const newTask = document.createElement("div");
  newTask.classList.add("task");

  const taskContent = document.createElement("span");
  taskContent.textContent = taskText;
  taskContent.classList.add("task-content");
  taskContent.contentEditable = true;

  const checkmarkButton = document.createElement("button");
  checkmarkButton.innerHTML = "✓";
  checkmarkButton.classList.add("checkmark-btn");

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "❌";
  deleteButton.classList.add("delete-btn");

  deleteButton.onclick = function () {
    if (newTask.parentElement) {
      newTask.parentElement.removeChild(newTask);
      saveTasks();
    }
  };

  newTask.appendChild(taskContent);
  newTask.appendChild(checkmarkButton);
  newTask.appendChild(deleteButton);

  checkmarkButton.onclick = function () {
    newTask.classList.toggle("completed");
    if (newTask.classList.contains("completed")) {
      tasksContainer.removeChild(newTask);
      completedTasksContainer.appendChild(newTask);
      newTask.removeChild(checkmarkButton);
      taskContent.contentEditable = false;
    }
    saveTasks();
    toggleEmptyState();
  };

  taskContent.addEventListener('input', () => {
    saveTasks();
  });

  return newTask;
}

function moveTaskToCompleted(taskElement) {
  taskElement.classList.toggle("completed");
  tasksContainer.removeChild(taskElement);
  completedTasksContainer.appendChild(taskElement);
  taskElement.removeChild(taskElement.querySelector(".checkmark-btn"));
  taskElement.querySelector(".task-content").contentEditable = false;
}

function toggleEmptyState() {
  if (tasksContainer.children.length > 0 || completedTasksContainer.children.length > 0) {
    emptyState.style.display = "none";
  } else {
    emptyState.style.display = "block";
  }
}

addButton.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const newTask = createEditableTask(taskText);
  tasksContainer.appendChild(newTask);
  taskInput.value = "";

  saveTasks();
  toggleEmptyState();
});

function saveTasks() {
  localStorage.setItem('tasks', tasksContainer.innerHTML);
  localStorage.setItem('completedTasks', completedTasksContainer.innerHTML);
}

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('tasks')) {
    tasksContainer.innerHTML = localStorage.getItem('tasks');
    attachEventListenersToTasks(tasksContainer);
  }
  if (localStorage.getItem('completedTasks')) {
    completedTasksContainer.innerHTML = localStorage.getItem('completedTasks');
    attachEventListenersToTasks(completedTasksContainer);
  }
  toggleEmptyState();
});

function attachEventListenersToTasks(container) {
  const deleteButtons = container.querySelectorAll('.delete-btn');
  const checkmarkButtons = container.querySelectorAll('.checkmark-btn');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const task = button.closest('.task');
      if (task.parentElement) {
        task.parentElement.removeChild(task);
        saveTasks();
        toggleEmptyState();
      }
    });
  });

  checkmarkButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const task = button.closest('.task');
      moveTaskToCompleted(task);
      saveTasks();
      toggleEmptyState();
    });
  });
}

tasksContainer.addEventListener('click', (event) => {
  const clickedElement = event.target;
  if (clickedElement.classList.contains('checkmark-btn')) {
    const task = clickedElement.closest('.task');
    moveTaskToCompleted(task);
    toggleEmptyState();
  }
});