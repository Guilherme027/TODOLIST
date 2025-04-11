import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
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

const tasksContainer = document.querySelector("#tasks");
const countValue = document.querySelector(".count-value");
const searchInput = document.querySelector("#search-input");

let allTasks = [];

const renderTasks = (filter = "") => {
  tasksContainer.innerHTML = `<p id="pending-tasks">Lista de presentes (<span class="count-value">0</span>)</p>`;

  let count = 0;

  allTasks.forEach(taskData => {
    const { task, taskId } = taskData;

    if (!task.name.toLowerCase().includes(filter.toLowerCase())) return;

    const taskEl = document.createElement("div");
    taskEl.className = "task";

    const quemVaiLevar = task.person ? `<small> - Reservado por: ${task.person}</small>` : "";

    taskEl.innerHTML = `
      <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""}>
      <span class="taskname ${task.completed ? "completed" : ""}">${task.name}${quemVaiLevar}</span>
    `;

    const checkbox = taskEl.querySelector(".task-check");

    checkbox.addEventListener("change", async () => {
      if (checkbox.checked) {
        const nome = prompt("Digite seu nome para marcar esse presente:");
        if (!nome) {
          alert("Você precisa digitar um nome para marcar o presente!");
          checkbox.checked = false;
          return;
        }
        update(ref(db, `tasks/${taskId}`), {
          completed: true,
          person: nome
        });
      } else {
        const confirmar = confirm("Deseja desmarcar este item?");
        if (confirmar) {
          update(ref(db, `tasks/${taskId}`), {
            completed: false,
            person: ""
          });
        } else {
          checkbox.checked = true;
        }
      }
    });

    if (!task.completed) count++;
    tasksContainer.appendChild(taskEl);
  });

  countValue.innerText = count;
};

onValue(tasksRef, snapshot => {
  allTasks = [];
  snapshot.forEach(child => {
    allTasks.push({ taskId: child.key, task: child.val() });
  });
  renderTasks(searchInput.value);
});

searchInput.addEventListener("input", () => {
  renderTasks(searchInput.value);
});
