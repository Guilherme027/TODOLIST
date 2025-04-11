import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// 🔧 Configuração do Firebase
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

// 🎁 Lista fixa de presentes (só roda uma vez para popular o banco)
const fixedTasks = {
  presente1: { name: "Conjunto de Panelas", completed: false },
  presente2: { name: "Toalhas de Banho", completed: false },
  presente3: { name: "Liquidificador", completed: false },
  presente4: { name: "Jogo de Copos", completed: false },
  presente5: { name: "Assadeira Refratária", completed: false },
  presente6: { name: "Faqueiro", completed: false }
};

// ⚠️ Descomente a linha abaixo para rodar uma vez e popular o Firebase
// Object.entries(fixedTasks).forEach(([id, task]) => set(ref(db, `tasks/${id}`), task));

// 🎯 Elementos da página
const tasksContainer = document.querySelector("#tasks");
const countValue = document.querySelector(".count-value");

// 📌 Atualiza a contagem de presentes disponíveis
const displayCount = () => {
  onValue(tasksRef, snapshot => {
    let total = 0;
    snapshot.forEach(child => {
      if (!child.val().completed) total++;
    });
    countValue.innerText = total;
  });
};

// 📋 Renderiza os presentes
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
      `;

      const checkbox = taskEl.querySelector(".task-check");

      if (task.completed) {
        checkbox.disabled = true;
      }

      checkbox.addEventListener("change", e => {
        if (!task.completed) {
          update(ref(db, `tasks/${taskId}`), {
            completed: true
          });
        }
      });

      tasksContainer.appendChild(taskEl);
    });

    displayCount();
  });
};

// 🚀 Inicialização
window.onload = () => {
  renderTasks();
  displayCount();
};
