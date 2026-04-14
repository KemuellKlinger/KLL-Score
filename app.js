let teams = [];
let current = 0;

function newState() {
    return {
        M01: 0, M01b: "none",
        M02a: false, M02b: false,
        M03a: false, M03b: false,
        M04: 0,
        M05: 0, M05b: false,
        M06: 0,
        M07a: false, M07p: 0,
        M08: 6
    };
}

function addTeam() {
    const name = prompt("Nome da equipe:");
    if (!name) return;

    teams.push({ name, state: newState(), score: 0 });
    updateTeams();
}

function changeTeam(i) {
    current = i;
    render();
}

function updateTeams() {
    const select = document.getElementById("teamSelect");
    select.innerHTML = "";
    teams.forEach((t, i) => {
        select.innerHTML += `<option value="${i}">${t.name}</option>`;
    });
}

function getState() { return teams[current].state; }

function add(k, v) {
    const state = getState();

    let value = (state[k] || 0) + v;

    if (k === "M07p" || k === "M01" || k === "M06") {
        value = Math.max(0, Math.min(3, value)); // limite 0–3
    } else {
        value = Math.max(0, value);
    }

    state[k] = value;
    render();
}

function toggle(k) {
    getState()[k] = !getState()[k];
    render();
}
const imagensM05 = [
    "missoes/m05_0.jpg",
    "missoes/m05_1.jpg",
    "missoes/m05_2.jpg",
    "missoes/m05_3.jpg",
    "missoes/m05_4.jpg"
];
function setLevel(k, v) {
    getState()[k] = v;

    if (k === "M05") {
        document.getElementById("imgM05").src = imagensM05[v];
    }

    render();
}

function setBonus(k, v) {
    getState()[k + "b"] = v;
    render();
}

function setRemaining(v) {
    getState().M08 = Number(v);
    render();
}


function calc(s) {
    let t = 0;

    t += s.M01 * 5;
    if (s.M01b === "balance") t += 10;
    if (s.M01b === "team") t += 20;

    if (s.M02a) t += 20;
    if (s.M02b) t += 10;

    if (s.M03a) t += 20;
    if (s.M03b) t += 10;

    t += [0, 10, 20, 30][s.M04];

    t += [0, 10, 20, 30, 40][s.M05];
    if (s.M05 === 4 && s.M05b) t += 10;

    t += s.M06 * 10;

    if (s.M07a) t += 30;
   t += Math.min(Math.max(s.M07p, 0), 3) * (-5);

    t += { 6: 50, 5: 50, 4: 35, 3: 25, 2: 15, 1: 10, 0: 0 }[s.M08];

    return t;
}

function render() {
    const s = getState();
    teams[current].score = calc(s);

    document.getElementById("total").innerText = teams[current].score  + " Pontos";
    document.getElementById("M01").innerText = s.M01;
    document.getElementById("M06").innerText = s.M06;
    document.getElementById("M07p").innerText = s.M07p;

    renderRanking();
}

function renderRanking() {
    let html = "<h2>Ranking</h2>";
    [...teams].sort((a, b) => b.score - a.score)
        .forEach((t, i) => {
            html += `<div>#${i + 1} ${t.name} - ${t.score}</div>`;
        });
    document.getElementById("ranking").innerHTML = html;
}

function setActive(btn) {
    const group = btn.parentElement.querySelectorAll("button");

    group.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

let time = 150;
let interval = null;
let rodando = false;
let finalizado = false;

function atualizarTimer() {
    let m = Math.floor(time / 60);
    let s = time % 60;

    document.getElementById("timer").innerText =
        `${m}:${s.toString().padStart(2, '0')}`;
}

function toggleTimer() {
    const btn = document.getElementById("btnTimer");

    // ESTADO 1: ainda não começou → INICIAR
    if (!rodando && !finalizado) {
        rodando = true;
        btn.innerText = "Resetar";

        interval = setInterval(() => {
            if (time > 0) {
                time--;
                atualizarTimer();
            } else {
                clearInterval(interval);
                rodando = false;
                finalizado = true;
                btn.innerText = "Resetar";
            }
        }, 1000);
    }

    // ESTADO 2: resetar (tanto durante quanto depois de terminar)
    else {
        clearInterval(interval);

        time = 150;
        rodando = false;
        finalizado = false;

        atualizarTimer();
        btn.innerText = "Iniciar";
    }
}
// iniciar
addTeam();