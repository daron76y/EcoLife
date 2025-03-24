if (!(localStorage && localStorage.getItem("localUsersList"))) {
    localStorage.setItem("localUsersList", JSON.stringify([]));
}

let leaderboardDiv = document.getElementsByClassName("leaderboard")[0];
let localUsersList = JSON.parse(localStorage.getItem("localUsersList"));
localUsersList.sort((a, b) => {
    if (a.score > b.score) {
        return -1;
    }
    else {
        return 1;
    }
});
localUsersList.forEach(element => {
    let boardUser = document.createElement("div");
    boardUser.classList.add("board-user");
    boardUser.innerHTML = `
        <img src="images/user.png" alt="user profile picture">
        <p>
            ${element.username}
        </p>
        <p class="score">
            ${element.score}
        </p>
    `
    leaderboardDiv.appendChild(boardUser);
});