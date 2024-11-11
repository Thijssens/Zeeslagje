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
  console.log(response);
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

  console.log(secret);
}

async function createGame() {
  if (document.querySelector("#game_acces").value === "Maak spel aan") {
    await startGame();
    await registerTeam();
    playGame("");
  } else {
    await registerTeam();
  }
}
//--------------------------------------------SPEEL SPEL-----------------------------------------------------------------------
async function getStatus(secret) {
  const response = await fetch(BASE_URL + "status/" + secret);
  const status = await response.json();
  console.log("Game status:", status);

  //maak eigen bord clickbaar enkel wanneer je de schepen nog moet plaatsen

  document.querySelector("#my-board").addEventListener("click", (event) => {
    let target = document.getElementById(event.target.id);
    let cell = target.id.slice(1);
    console.log(cell);

    document.querySelector("#start-position").innerText = cell;
  });
}

async function getShips(secret) {
  const response = await fetch(BASE_URL + "ships/" + secret);
  const ships = await response.json();
  console.log(ships);

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
  console.log("hallo");

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

function playGame(secret) {
  getStatus(secret);
  getShips(secret);
}

document
  .querySelector("#start_button")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    createGame();
  });
