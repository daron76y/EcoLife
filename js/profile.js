if (localStorage && localStorage.getItem("currentUser") && localStorage.getItem("localUsersList")) {
    let helloUserH2 = document.getElementById("hello-user");
    helloUserH2.innerText = "Hello, " + localStorage.getItem("currentUser");

    JSON.parse(localStorage.getItem("localUsersList")).forEach(element => {
        if (localStorage.getItem("currentUser") == element.username) {
            let bioParagraph = helloUserH2.nextSibling.nextSibling;
            bioParagraph.innerHTML = `
                <b>Username:</b> ${element.username} <br>
                <b>Email:</b> ${element.email} <br>
                <b>Birthday:</b> ${new Date(element.birthday).toDateString()} <br> <br>
                <b>Score:</b> ${element.score}
            `;
            console.log(bioParagraph);
        }
    });
}

function logOut() {
    localStorage.setItem("currentUser", JSON.stringify(null));
    window.location.assign("login.html");
}