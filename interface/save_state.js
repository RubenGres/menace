function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
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
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getListFromCookie() {
    let listCookie = getCookie('board_history');
    return listCookie ? JSON.parse(listCookie) : [];
}

function saveStateToCookie(current_state) {
    let list = getListFromCookie();
    list.push(current_state);
    setCookie('board_history', JSON.stringify(list));
}

function save_current_state() {
    saveStateToCookie(current_state);
    console.log(getListFromCookie())
}

function clearCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
  