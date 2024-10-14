const BASE_URL = 'https://koene.cvoatweb.be/api/public/zeeslagje/start';

async function startGame(password){
    let response = await fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify({password}),
    });
    let zeeslagdata = await response.json();


console.log(zeeslagdata);


    }
    startGame('ola')