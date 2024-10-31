const BASE_URL = "https://koene.cvoatweb.be/api/public/zeeslagje/";

let secret = "";

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
  if (data.secret) {
    secret = data.secret;
  }
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

      const response = await fetch(BASE_URL + "status/" + secret);
      if (response.ok) {
          const status = await response.json();
          console.log("Game status:", status); 
      } else {
          console.error("Failed to get game status.");
          console.log(secret);
      }
      
  }


    document.querySelector("#status_button").addEventListener("click", getStatus);


 

  






