const STORAGE_KEY_USERS = "flagGame_users";
const STORAGE_KEY_SCORES = "flagGame_scores";
const STORAGE_KEY_ACTIVE = "flagGame_activeUser";
const STORAGE_KEY_DIFFICULTY = "flagGame_difficulty";
const STORAGE_KEY_BEST_SCORES = "flagGame_bestScore";

const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || "{}");
const saveUsers = (users) => localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
const getActiveUser = () => localStorage.getItem(STORAGE_KEY_ACTIVE);
const setActiveUser = (user) => localStorage.setItem(STORAGE_KEY_ACTIVE, user);

let gameData = { questions: [], currentIndex: 0, score: 0, timer: null, timeLeft: 30 };


function initLogin() {


    const loginContainer = document.getElementById("login-container");
    const registerContainer =  document.getElementById("register-container");

    const loginUsername = document.getElementById("login-username");
    const loginPassword =  document.getElementById("login-password");
    const loginBtn = document.getElementById("login-btn");
    const openRegisterBtn = document.getElementById("open-register");
    const loginMsg = document.getElementById("login-message");

    const regName = document.getElementById("reg-name");
    const regSurname = document.getElementById("reg-surname");
    const regUsername =  document.getElementById("reg-username");
    const regPassword = document.getElementById("reg-password");
    const registerBtn = document.getElementById("register-btn");
    const backLoginBtn = document.getElementById("back-login");
    const registerMsg = document.getElementById("register-message");

    openRegisterBtn.onclick = () => {
        loginContainer.style.display = "none";
        registerContainer.style.display = "block";
    };
    

    backLoginBtn.onclick = () => {
        registerContainer.style.display = "none";
        loginContainer.style.display = "block";
    };

    loginBtn.onclick = () => { 

        const users = getUsers();
if (!loginUsername.value || !loginPassword.value) {
    loginMsg.style.display = "block";
    loginMsg.textContent = "Username and password cannot be empty.";
    return;
}

        if (users[loginUsername.value] === sha256Simple(loginPassword.value)) {
            setActiveUser(loginUsername.value);
            window.location.href = "home.html";
        } else {
            loginMsg.style.display = "block";
            loginMsg.textContent = "Incorrect username or password.";
        }
        }            

        

    registerBtn.onclick = () => {

        if (!regName.value || !regSurname.value || !regUsername.value || !regPassword.value) {
            registerMsg.style.display = "block";
            registerMsg.textContent = "Fill in all field.";
             return;
        }

        const users = getUsers();

        if (users[regUsername.value]) {
           registerMsg.style.display = "block";
           registerMsg.textContent = "This username is already being used.";
            return;
        }
        if (registerBtn.onclick === true) {
            if (!regName.value || !regSurname.value || !regUsername.value || !regPassword.value)
                registerMsg.style.display = "block";
                registerMsg.textContent = ".";

        }

        users[regUsername.value] = sha256Simple(regPassword.value);
        saveUsers(users);
        registerMsg.style.display = "block";
        registerMsg.textContent = "register success!";

        registerContainer.style.display = "block";
        loginContainer.style.display = "none";
    };
}


function checkAnswers(isTimeout = false) {
    clearInterval(gameData.timer);

    const question = gameData.questions[gameData.currentIndex];

    const inputName = document.getElementById("input-country").value;
    const inputCapital = document.getElementById("input-capital").value;
    const inputPopulation =
        parseInt(document.getElementById("input-population").value) || 0;

    const inName =
        normalize(inputName) === normalize(question.name);

    const inCapital =
        normalize(inputCapital) === normalize(question.cap);

    const inPopulation =
        Math.abs(inputPopulation - question.pop) <= question.pop * 0.1;

    let point = 0;
    if (inName) point += 1;
    if (inCapital) point += 1;
    if (inPopulation) point += 1;

    gameData.score += point;

    document.getElementById("total-score-display").textContent =
        `Point: ${gameData.score}`;

    const resultMsg = document.getElementById("result-message");

    const allCorrect = inName && inCapital && inPopulation;

    resultMsg.innerHTML = `
        <div style="background: rgba(229,226,226,0.2);
                    padding:15px;
                    border-radius:10px;
                    margin-top:10px;
                    text-align:left;">

            <h4 style="color:${allCorrect ? '#4cc9f0' : '#f72585'};
                       margin-bottom:8px;">

                ${isTimeout 
                    ? '⌛ Time is Over!' 
                    : allCorrect 
                        ? '🎉 Perfect Answer!' 
                        : '❌ Some Answers Are Wrong'}
                (+${point} Point)
            </h4>

            <div style="font-size:0.9rem; line-height:1.6;">
                <p><strong>🌍 COUNTRY :</strong> 
                    ${question.name} ${inName ? '✓' : '✘'}
                </p>

                <p><strong>🏛️ CAPITAL :</strong> 
                    ${question.cap} ${inCapital ? '✓' : '✘'}
                </p>

                <p><strong>👥 POPULATION :</strong> 
                    ${question.pop.toLocaleString()} 
                    ${inPopulation ? '✓' : '✘'}
                </p>
            </div>
        </div>
    `;

    ["input-country", "input-capital", "input-population"]
        .forEach(id => document.getElementById(id).disabled = true);

    document.getElementById("btn-submit").style.display = "none";

    const btnNext = document.getElementById("btn-next");
    btnNext.style.display = "block";
    btnNext.disabled = false;
}

function sha256Simple(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString(36);
}

function normalize(str) {
    return (str || "").trim().toLowerCase()
        .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
        .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
}

function initHome(currentUser) {
    const startButton = document.getElementById("start-btn");
    const scoreButton = document.getElementById("score-btn");
    const logoutButton = document.getElementById("logout-btn");
    const welcomeMessage = document.getElementById("welcome-Message");

    if (currentUser) {
        welcomeMessage.style.display = "block";
        welcomeMessage.textContent = `Hi, ${currentUser}!`;
    }

    startButton.onclick = () => window.location.href = "game.html"


    
    
    scoreButton.onclick = () =>window.location.href = "scoreboard.html";
logoutButton.onclick = () => {
    localStorage.removeItem(STORAGE_KEY_ACTIVE);
    window.location.href = "index.html";
};}


function setupGameEvents() {
    document.getElementById("btn-submit").onclick = checkAnswers;
    document.getElementById("btn-next").onclick = () => {
        gameData.currentIndex++;
        if (gameData.currentIndex < 10) {
            showQuestion();
        } else {
            finishGame();
        }
    };
}

function setupGameEvents() {

    const btnSubmit = document.getElementById("btn-submit");
    const btnNext = document.getElementById("btn-next");

    const inputs = [
        document.getElementById("input-country"),
        document.getElementById("input-capital"),
        document.getElementById("input-population")
    ];

    btnSubmit.onclick = checkAnswers;

    btnNext.onclick = () => {
        gameData.currentIndex++;
        if (gameData.currentIndex < 10) {
            showQuestion();
        } else {
            finishGame();
        }
    };

    inputs.forEach(input => {
        input.addEventListener("input", () => {
            const anyFilled = inputs.some(i => i.value.trim() !== "");
            btnSubmit.disabled = !anyFilled;
        });
    });
}
async function initGame() {
    const difficulty = localStorage.getItem("flagGame_difficulty") || "medium";
    try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,capital,population,flags");
        const data = await res.json();
        const all = data.map(temp => ({
            name: temp.name.common,
            cap: temp.capital ? temp.capital[0] : "No",
            pop: temp.population,
            flag: temp.flags.png
        }));

        let filtered = all;
        if (difficulty === "easy") filtered = all.filter(temp => temp.pop > 50000000);
        else if (difficulty === "hard") filtered = all.filter(temp => temp.pop < 1000000);

        gameData.questions = filtered.sort(() => 0.5 - Math.random()).slice(0, 10);
        setupGameEvents();
        showQuestion();
    } catch (err) { console.error("API Error:", err); }

    const buttonSkip = document.getElementById("btn-skip");
    buttonSkip.onclick = () => {
        
        if (gameData.currentIndex < 10) {
            showQuestion();
            gameData.currentIndex++;
            checkAnswers(true);

        } else {
            finishGame();
        }
    };

    const buttonEnd = document.getElementById("btn-end");
    buttonEnd.onclick = () => finishGame();
}



function showQuestion() {

    const q = gameData.questions[gameData.currentIndex];

    document.getElementById("question-number").textContent =
        gameData.currentIndex + 1;

    document.getElementById("progress-bar").style.width =
        `${(gameData.currentIndex + 1) * 10}%`;

    document.getElementById("flag").src = q.flag;

    resetUI();      
    startTimer();    
}
function resetUI() {

    const btnSubmit = document.getElementById("btn-submit");
    const btnNext = document.getElementById("btn-next");

    const inputs = [
        document.getElementById("input-country"),
        document.getElementById("input-capital"),
        document.getElementById("input-population")
    ];

    inputs.forEach(input => {
        input.value = "";
        input.disabled = false;
    });

    btnSubmit.disabled = true; 
    btnSubmit.style.display = "block";

    btnNext.style.display = "none";
    btnNext.disabled = true;

    document.getElementById("result-message").innerHTML = "";
}

function checkInputs() {
    const inputCountry = document.getElementById("input-country").value.trim();
    const inputCapital = document.getElementById("input-capital").value.trim();
    const inputPopulation = document.getElementById("input-population").value.trim();

    const btnSubmit = document.getElementById("btn-submit");

    if (inputCountry !== "" || inputCapital !== "" || inputPopulation !== "") {
        btnSubmit.disabled = false;
    } else {
        btnSubmit.disabled = true;
    }
}
function finishGame() {
    clearInterval(gameData.timer);

    const user = getActiveUser();
    const difficulty = localStorage.getItem(STORAGE_KEY_DIFFICULTY) || "medium";

    const allScores = JSON.parse(localStorage.getItem(STORAGE_KEY_SCORES) || "{}");
    if (!allScores[user]) allScores[user] = [];

    allScores[user].push({
        date: new Date().toISOString(),
        difficulty: difficulty,
        score: gameData.score
    });

    localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(allScores));

    document.querySelector(".game-layout").style.display = "none";

    document.getElementById("end-screen").classList.remove("hidden");
    document.getElementById("final-score").textContent = gameData.score;

    const text = document.getElementById("performance-text");

    if (gameData.score >= 25) {
        text.textContent = "🌍 amazing!";
    } else if (gameData.score >= 15) {
        text.textContent = "📚 no bad!";
    } else {
        text.textContent = "👀 try again!";
    }
    
    const restartButton = document.getElementById("btn-restart");
    restartButton.onclick = () => {
        window.location.href = "home.html";
    };

    const scoreboardButton = document.getElementById("btn-scoreboard");
    scoreboardButton.onclick = () => {
        window.location.href = "scoreboard.html";
    };
    
}

function startTimer() {
    clearInterval(gameData.timer);
    gameData.timeLeft = 30;
    const display = document.getElementById("timer-display");
    display.textContent = gameData.timeLeft;
    display.style.color = "white";

    gameData.timer = setInterval(() => {
        gameData.timeLeft--;
        display.textContent = gameData.timeLeft;
        
        if (gameData.timeLeft <= 10) display.style.color = "var(--danger)";
        if (gameData.timeLeft <= 0) {
            clearInterval(gameData.timer);
            checkAnswers(true);
        }
    }, 1000);
}


function renderScores(container, scores, isGlobal = false) {
  container.innerHTML = '';

  if (scores.length === 0) {
    container.innerHTML = '<div class="empty-message">Henüz skor kaydedilmemiş...</div>';
    return;
  }

  scores.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'score-item';

    div.innerHTML = `
      <div class="rank ${index < 3 ? 'rank-' + (index+1) : ''}">${index + 1}</div>
      <div class="username">${isGlobal ? item.username : 'Sen'}</div>
      <div class="difficulty">${item.difficulty || '—'}</div>
      <div class="score-value">${item.score}</div>
    `;

    container.appendChild(div);
  });
}

function renderTable(tableBody, data, isGlobal = false) {
    tableBody.innerHTML = '';

    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4" style="padding:2rem; text-align:center; color:#94a3b8;">No score yet...</td>`;
        tableBody.appendChild(row);
        return;
    }

    data.forEach((item, index) => {
        const tr = document.createElement('tr');

        let col1, col2;
        if (isGlobal) {
            col1 = `<td>${index + 1}</td>`;
            col2 = `<td>${item.username}</td>`;
        } else {
            col1 = `<td>${index + 1}</td>`;
            col2 = `<td>${new Date(item.date).toLocaleDateString('tr-TR')}</td>`;
        }

        tr.innerHTML = `
            ${col1}
            ${col2}
            <td>${item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}</td>
            <td>${item.score}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function renderMyLastScores(tbody, scores) {
  tbody.innerHTML = "";
  if (scores.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="empty">You haven\'t played the game yet...</td></tr>';
    return;
  }

  scores.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(item.date).toLocaleDateString("tr-TR")}</td>
      <td>${item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}</td>
      <td class="score-cell">${item.score}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderGlobalTop(tbody, scores) {
  tbody.innerHTML = "";
  if (scores.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty">There is no global score yet...</td></tr>';
    return;
  }

  scores.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${item.username}</td>
      <td>${item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}</td>
      <td class="score-cell">${item.score}</td>
    `;
    tbody.appendChild(tr);
  });
}

function initScoreboard() {
  const user = getActiveUser();
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const allScores = JSON.parse(localStorage.getItem(STORAGE_KEY_SCORES) || "{}");
  const myScores = allScores[user] || [];

  let globalScores = [];
  for (let username in allScores) {
    allScores[username].forEach(s => {
      globalScores.push({ ...s, username });
    });
  }

  const filter = document.getElementById("difficulty-filter"); 
  const myTbody = document.querySelector("#my-recent-table tbody"); 
  const globalTbody = document.querySelector("#global-top-table tbody");

  function update() {
    const val = filter.value;

    let filteredMy = val === "all" ? myScores : myScores.filter(s => s.difficulty === val);
    let recent = [...filteredMy].reverse().slice(0, 10);
    renderMyLastScores(myTbody, recent);

    let filteredGlobal = val === "all" ? globalScores : globalScores.filter(s => s.difficulty === val);
    let top = filteredGlobal
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    renderGlobalTop(globalTbody, top);
  }

  if (filter) {
    filter.addEventListener("change", update);
    update();
  }

  const backBtn = document.getElementById("back-to-home");
  if (backBtn) {
    backBtn.onclick = () => {
      window.location.href = "home.html";
    };
  }
}

function passwordToggle() {

    const passwordInput = document.getElementById("login-password");
    const toggleBtn = document.getElementById("toggle-password");

    if (toggleBtn && passwordInput) {
        toggleBtn.onclick = () => {
            passwordInput.type =
                passwordInput.type === "password" ? "text" : "password";

            toggleBtn.textContent =
                passwordInput.type === "password" ? "👁" : "🙈";
        };
    }

    const registerPasswordInput = document.getElementById("reg-password");
    const toggleBtnRegister = document.getElementById("toggle-password-register");

    if (toggleBtnRegister && registerPasswordInput) {
        toggleBtnRegister.onclick = () => {
            registerPasswordInput.type =
                registerPasswordInput.type === "password" ? "text" : "password";

            toggleBtnRegister.textContent =
                registerPasswordInput.type === "password" ? "👁" : "🙈";
        };
    }
}
function renderScoreList(container, scores, isGlobal = false) {
    container.innerHTML = '';

    if (scores.length === 0) {
        container.innerHTML = '<div class="no-data">No score yet...</div>';
        return;
    }

    scores.forEach((s, i) => {
        const row = document.createElement('div');
        row.className = 'score-row';

        const rank = document.createElement('div');
        rank.className = 'rank-num';
        rank.textContent = `#${i + 1}`;

        const nameOrDate = document.createElement('div');
        nameOrDate.className = 'player-name';
        if (isGlobal) {
            nameOrDate.textContent = s.username;
        } else {
            nameOrDate.textContent = new Date(s.date).toLocaleDateString('tr-TR', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        }

        const diffEl = document.createElement('div');
        diffEl.className = 'diff';
        diffEl.textContent = s.difficulty;

        const pointsEl = document.createElement('div');
        pointsEl.className = 'points';
        pointsEl.textContent = s.score;

        row.append(rank, nameOrDate, diffEl, pointsEl);
        container.appendChild(row);

setTimeout(() => {
    const lists = document.querySelectorAll('.score-list');
    lists.forEach(list => {
        list.style.minHeight = list.scrollHeight + 'px';
    });
}, 100);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const page = window.location.pathname.split("/").pop();
    const user = getActiveUser();

    if (!user && page !== "index.html" && page !== "" && page !== "index") {
        window.location.href = "index.html";
        return;
    }

    if (page === "index.html" || page === "") initLogin();
    if (page === "home.html") initHome(user);
    if (page === "game.html") initGame();
    if (page === "scoreboard.html") initScoreboard();

    passwordToggle();
});




