const BASE_URL = "https://koene.cvoatweb.be/api/public/zeeslagje/";

// let secret = ""; Global variabele is niet nodig: vanuit registerTeam(), functie playGame() aanroepen en zo de secret meegeven
//---------------------------------------------MAAK SPEL---------------------------------------------------------------------------------------------------
function getPassword() {
  let password = document.querySelector("#password").value;
  return password;
}

function getTeamName() {
  let teamName = document.querySelector("#name").value;
  return teamName;
}

async function startGame() {
  let password = getPassword();

  let response = await fetch(BASE_URL + "start", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

async function registerTeam() {
  let name = getTeamName();

  let password = getPassword();

  let response = await fetch(BASE_URL + "register/" + password, {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  let data = await response.json();

  const secret = data.secret;

  if (secret) {
    playGame(secret);
  }
}

async function createGame() {
  if (document.querySelector("#game_acces").value === "Maak spel aan") {
    await startGame();
    await registerTeam();
    //playGame("28905692e0c9c63806688472911c335b");
  } else {
    //playGame("dd20ee73121d15cff5b7f913044ac696");
    await registerTeam();
  }
}
//--------------------------------------------SPEEL SPEL-----------------------------------------------------------------------
function playGame(secret) {
  document.querySelector("#game-comment").innerText = "Plaats uw schepen";
  let gameStatus = setInterval(getStatus, 1000, secret);
  // let gameStatus = getStatus(secret);
  getShips(secret);

  document.querySelector("#place-ship").addEventListener("click", () => {
    placeShip(secret, gameStatus);
  });
}

async function getStatus(secret) {
  const response = await fetch(BASE_URL + "status/" + secret);
  const gameStatus = await response.json();
  const myTeam = gameStatus.myTeamName;
  const enemyTeam = gameStatus.opponentTeamName;

  document.querySelector("#my-name").innerText = myTeam;
  document.querySelector("#opponent-name").innerText = enemyTeam;

  fillBoard(gameStatus.myBoard, "m"); //vult mijn speelbord in

  fillBoard(gameStatus.opponentBoard, "o"); //vult tegenstander zijn speelbord in

  //maak eigen bord clickbaar enkel wanneer je de schepen nog moet plaatsen
  if (gameStatus.isReady === false) {
    document.querySelector("#my-board").addEventListener("click", (event) => {
      let cell = getCell(event);
      document.querySelector("#start-position").innerText = cell;
    });
  }

  if (
    gameStatus.isReady === true &&
    gameStatus.isOpponentReady === true &&
    gameStatus.yourTurn === true
  ) {
    // je kan enkel aanvallen wanneer het jouw beurt is
    document
      .querySelector("#opponent-board")
      .addEventListener("click", (event) => {
        let cell = getCell(event);
        attackShips(cell, secret);
      });
  }

  //toon wie aan de beurt is

  if (gameStatus.isReady === true && gameStatus.isOpponentReady === true) {
    document.querySelector("#game-comment").innerText = "Speel!";

    if (gameStatus.yourTurn === true) {
      document.querySelector("#turn-indicator").innerText =
        myTeam + " is aan de beurt.";
    }
    if (gameStatus.yourTurn === false) {
      document.querySelector("#turn-indicator").innerText =
        enemyTeam + " is aan de beurt.";
    }
  }

  //toon wie er is gewonnen
  if (gameStatus.victory === true && gameStatus.lost === false) {
    //ik weet niet of deze && meerwaarde biedt, maar dubbele beviliging kan geen kwaad
    document.querySelector("#turn-indicator").innerText =
      myTeam + " is gewonnen!";
  }

  if (gameStatus.lost === true && gameStatus.victory === false) {
    document.querySelector("#turn-indicator").innerText =
      enemyTeam + " is gewonnen :(";
  }
}

async function getShips(secret) {
  const response = await fetch(BASE_URL + "ships/" + secret);
  const ships = await response.json();

  let select = document.querySelector("#ship"); //select in HTML

  select.innerHTML = null;

  select.add(new Option("Selecteer een schip"));

  ships.forEach((ship) => {
    // vult de select op
    const option = document.createElement("option");
    option.value = ship.name;
    option.text = ship.name;
    if (ship.quantity === 0) {
      option.disabled = true;
    }
    select.add(option);
  });

  document.querySelector("#ship").addEventListener("change", () => {
    viewShipDetails(ships);
  });
}

function viewShipDetails(ships) {
  const selectedShip = document.querySelector("#ship").value;
  let quantity = document.querySelector("#ship-quantity");
  let length = document.querySelector("#ship-length");

  if (selectedShip === "Selecteer een schip") {
    quantity.innerText = "";
    length.innerText = "";
    return;
  }

  ships.forEach((ship) => {
    if (ship.name === selectedShip) {
      quantity.innerText = ship.quantity;
      length.innerText = ship.length;
      return;
    }
  });
}

async function placeShip(secret, gameStatus) {
  //plaatsen van schepen
  if (gameStatus.isReady === true) {
    return;
  }

  let start = document.querySelector("#start-position").innerText;
  let type = document.querySelector("#ship").value;
  let direction = document.querySelector("#ship-direction").value;

  let response = await fetch(BASE_URL + "ship", {
    method: "POST",
    body: JSON.stringify({ secret, start, type, direction }),
  });
  let data = await response.json();

  getShips(secret);
}

async function attackShips(position, secret) {
  let response = await fetch(BASE_URL + "attack", {
    method: "POST",
    body: JSON.stringify({ secret, position }),
  });
  let data = await response.json();
}

function getCell(event) {
  let target = document.getElementById(event.target.id); //ophalen van coordinaten verplaatst in functie
  let cell = target.id.slice(1);

  return cell;
}

function fillBoard(board, player) {
  //functie om beide borden op te vullen
  let placedShips = [];
  let shipHits = [];
  let shipMisses = [];

  for (i = 1; i < 11; i++) {
    let row = board[i]; // van internet gehaald, begrijp het niet volledig, maar werkt wel. is nodig omdat we de key moeten hebben.
    for (const coordinate in row) {
      if (row[coordinate] === "S") {
        placedShips.push(coordinate);
      }
      if (row[coordinate] === "X") {
        shipHits.push(coordinate);
      }
      if (row[coordinate] === "0") {
        shipMisses.push(coordinate);
      }
    }
  }
  placedShips.forEach((coordinate) => {
    document.querySelector("#" + player + coordinate).classList.add("ship");
  });
  shipHits.forEach((coordinate) => {
    document.querySelector("#" + player + coordinate).classList.add("ship");
    document.querySelector("#" + player + coordinate).innerText = "X";
  });
  shipMisses.forEach((coordinate) => {
    document.querySelector("#" + player + coordinate).innerText = "0";
  });
}

document
  .querySelector("#start_button")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    createGame();
  });
