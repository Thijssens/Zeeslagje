const BASE_URL = "https://koene.cvoatweb.be/api/public/zeeslagje/";

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

  let secret = await response.json();
  console.log(secret);
}

document.querySelector("#start_button").addEventListener("click", async (event) => {
    event.preventDefault();

    if (document.querySelector("#game_acces").value === "Maak spel aan") {
      startGame();
      registerTeam();
    } else {
      registerTeam();
    }
  });



async function getStatus() {
      const response = await fetch(BASE_URL + "status");
      if (response.ok) {
          const status = await response.json();
          console.log("Game status:", status); 
      } else {
          console.error("Failed to get game status.");
      }
    }

  async function getShips() {
    const response = await fetch(BASE_URL + 'ships');
    const data = await response.json();
    const shipDropdown = document.querySelector('#ship');
    shipDropdown.innerHTML = ''; 

    data.forEach(ship => {
        shipDropdown.add(new Option(ship.name));  
        console.log(shipDropdown);
    });

  
}





