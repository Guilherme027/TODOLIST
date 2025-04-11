import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBeaGfpMpZicoePT7DdseCEn2HlcA0bkA8",
  authDomain: "listas-de-presentes.firebaseapp.com",
  projectId: "listas-de-presentes",
  storageBucket: "listas-de-presentes.appspot.com",
  messagingSenderId: "999374746812",
  appId: "1:999374746812:web:358b215e2d27f68c864cb9",
  measurementId: "G-E45PP7LRJN",
  databaseURL: "https://listas-de-presentes-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const tasksRef = ref(db, "tasks");

const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const tasksContainer = document.querySelector("#tasks");
const countValue = document.querySelector(".count-value");
const error = document.getElementById("error");

const displayCount = () => {
  onValue(tasksRef, snapshot => {
    let total = 0;
    snapshot.forEach(child => {
      if (!child.val().completed) total++;
    });
    countValue.innerText = total;
  });
};

const renderTasks = () => {
  onValue(tasksRef, snapshot => {
    tasksContainer.innerHTML = '<p id="pending-tasks">Lista de presentes (<span class="count-value">0</span>)</p>';
    snapshot.forEach(child => {
      const task = child.val();
      const taskId = child.key;
      const taskEl = document.createElement("div");
      taskEl.className = "task";
      taskEl.innerHTML = `
        <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""}>
        <span class="taskname ${task.completed ? "completed" : ""}">${task.name}</span>
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="far fa-trash-alt"></i></button>
      `;

      taskEl.querySelector(".task-check").addEventListener("change", e => {
        update(ref(db, `tasks/${taskId}`), {
          completed: e.target.checked
        });
      });

      taskEl.querySelector(".edit").addEventListener("click", () => {
        newTaskInput.value = task.name;
        remove(ref(db, `tasks/${taskId}`));
      });

      taskEl.querySelector(".delete").addEventListener("click", () => {
        remove(ref(db, `tasks/${taskId}`));
      });

      tasksContainer.appendChild(taskEl);
      displayCount();
    });
  });
};

const addTask = () => {
  const taskName = newTaskInput.value.trim();
  error.style.display = "none";

  if (!taskName) {
    setTimeout(() => {
      error.style.display = "block";
    }, 200);
    return;
  }

  push(tasksRef, {
    name: taskName,
    completed: false
  });

  newTaskInput.value = "";
};

addBtn.addEventListener("click", addTask);
window.onload = () => {
  renderTasks();
  displayCount();
};
