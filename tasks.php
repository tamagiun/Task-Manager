<?php
$tasksFile = 'tasks.json';

// Read tasks from JSON file
function readTasksFromJSON() {
  global $tasksFile;
  $tasksData = file_get_contents($tasksFile);
  return json_decode($tasksData, true);
}

// Write tasks to JSON file
function writeTasksToJSON($tasks) {
  global $tasksFile;
  $tasksData = json_encode($tasks, JSON_PRETTY_PRINT);
  file_put_contents($tasksFile, $tasksData);
}

// Add Task
function addTask($taskText, $taskDate) {
  $tasks = readTasksFromJSON();
  $taskId = uniqid();
  $task = array(
    'id' => $taskId,
    'text' => $taskText,
    'date' => $taskDate
  );
  $tasks[] = $task;
  writeTasksToJSON($tasks);
}

// Delete Task
function deleteTask($taskId) {
  $tasks = readTasksFromJSON();
  foreach ($tasks as $key => $task) {
    if ($task['id'] === $taskId) {
      array_splice($tasks, $key, 1);
      writeTasksToJSON($tasks);
      break;
    }
  }
}

// Update Task
function updateTask($taskId, $taskName, $taskDate) {
  $tasks = readTasksFromJSON();
  foreach ($tasks as &$task) {
    if ($task['id'] === $taskId) {
      $task['text'] = $taskName;
      $task['date'] = $taskDate;
      break;
    }
  }
  writeTasksToJSON($tasks);
}

// Handle HTTP methods
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Read tasks
  $tasks = readTasksFromJSON();
  echo json_encode($tasks);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Add task
  $data = json_decode(file_get_contents('php://input'), true);
  $taskText = $data['text'];
  $taskDate = $data['date'];
  addTask($taskText, $taskDate);
  echo 'Task added successfully!';
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  // Delete task
  $data = json_decode(file_get_contents('php://input'), true);
  $taskId = $data['id'];
  deleteTask($taskId);
  echo 'Task deleted successfully!';
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  // Update task
  $data = json_decode(file_get_contents('php://input'), true);
  $taskId = $data['id'];
  $taskName = $data['text'];
  $taskDate = $data['date'];
  updateTask($taskId, $taskName, $taskDate);
  echo 'Task updated successfully!';
} else {
  // Invalid request
  echo 'Invalid request!';
}
?>
