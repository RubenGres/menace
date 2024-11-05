function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        console.log(cookiePair)
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    return null;
}

function setCookie(name, value, days = 365) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    let expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/";
    return getCookie(name);
}

let current_game = []
let all_games = []
function getListFromCookie() {
    return all_games;
}

function saveToCookie(value) {
    let list = getListFromCookie();
    list.push(value);
    setCookie('board_history', JSON.stringify(list));
}


function update_game(current_state) {
    current_game.push(current_state.slice());
}

function save_game() {
    all_games.push(current_game)
    current_game = [];
}

function clearCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
