const addButton = document.getElementById('addTaskButton');
const taskInput = document.getElementById('taskInput');
const tasksContainer = document.getElementById('tasksContainer');
const completedTasksContainer = document.getElementById('completedTasks');

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
      toggleEmptyState();
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
  const hasTasks = tasksContainer.children.length > 0;
  const hasCompletedTasks = completedTasksContainer.children.length > 0;

  const emptyStateCurrent = document.getElementById('emptyStateCurrent');
  const emptyStateCompleted = document.getElementById('emptyStateCompleted');

  emptyStateCurrent.style.display = hasTasks ? "none" : "block";
  emptyStateCompleted.style.display = hasCompletedTasks ? "none" : "block";
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
