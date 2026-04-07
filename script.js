// localStorage.getItem("tasks") loeb eelnevalt salvestatud ülesanded
// JSON.parse muudab salvestatud stringi tagasi objektiks
// || [] kui ülesanded puuduvad, alustab tühja listiga
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// NAV vahetamine
// document.querySelectorAll(".section") leiab kõik lehe sektsioonid
// .classList.add("d-none") peidab kõik sektsioonid
// document.getElementById(sectionId).classList.remove("d-none") näitab kõik sektsioonid
// Nav-linkid kontrollib klasside aktiivsust
function showSection(event, sectionId) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.add("d-none");
    });

    document.getElementById(sectionId).classList.remove("d-none");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
    });

    event.target.classList.add("active");
}

// Render
//List puhastakse enne kuvamist 
// ja filter määrab kas näitada kõik, pooleli või tehtud
function renderTasks(filter = "all") {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks
        .map((task, index) => ({ task, index })) // säilitab originaalindeksi
        .filter(({ task }) => { //filtreerib ülesanded 
            if (filter === "active") return !task.done;
            if (filter === "done") return task.done;
            return true;
        })
        .forEach(({ task, index }) => {

            const li = document.createElement("li"); // iga ülesanne listis
            li.className = "list-group-item d-flex justify-content-between align-items-center";

            const span = document.createElement("span"); // kuvab ülesande teksti, 'done' lisatakse kui tehtud
            span.textContent = task.text;
            if (task.done) span.classList.add("done");

            const actions = document.createElement("div"); //hoiab nuppe

            // märgib Tehtuks
            const doneBtn = document.createElement("button");
            doneBtn.textContent = "✔️";
            doneBtn.className = "btn btn-sm btn-success me-2";
            doneBtn.onclick = () => toggleTask(index);

            //Kustutab
            const del = document.createElement("button");
            del.textContent = "❌";
            del.className = "btn btn-sm btn-danger";
            del.onclick = () => deleteTask(index);

            //Järjastakse elemendid õigesse järjekorda ja li lisatakse listi
            actions.appendChild(doneBtn);
            actions.appendChild(del);

            li.appendChild(span);
            li.appendChild(actions);

            list.appendChild(li);
        });
    
    //Muutatused salvestatakse LocalStoragisse, et ei kaduks pärast värskendust
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Võtab kasutaja sisendi ja lisab uue ülesande
function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (!text) return;

    //tühjendab sisendi ja kutsub uuesti renderTasks()
    tasks.push({ text, done: false });
    input.value = "";
    renderTasks();
}

// Muudab ülesande staatust
function toggleTask(i) {
    tasks[i].done = !tasks[i].done;
    renderTasks();
}

// Eemaldab ülesande listist
function deleteTask(i) {
    tasks.splice(i, 1);
    renderTasks();
}

// Kutsub renderTasks
function filterTasks(type) {
    renderTasks(type);
}

// loeb kahte arvu
function calculate(op) {
    const n1 = Number(document.getElementById("num1").value);
    const n2 = Number(document.getElementById("num2").value);

    let r = 0;

    //teeb vastava tehte (op)
    if (op === "+") r = n1 + n2;
    if (op === "-") r = n1 - n2;
    if (op === "*") r = n1 * n2;
    if (op === "/") r = n2 !== 0 ? n1 / n2 : "Viga";

    document.getElementById("result").textContent = r;
}

// Dark mode
function toggleTheme() {
    document.body.classList.toggle("dark");

    // salvestab valiku LocalStorageisse
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

// Taasta teema
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

// Laeb kõik olemasolevad ülesanded
//Taastab LocalStorageis tehtud olekud ja filtrid
renderTasks();

