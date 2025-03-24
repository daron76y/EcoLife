if (localStorage && localStorage.getItem("currentUser")) {
    let navBar = document.getElementsByTagName("nav")[0];
    let lastLink = navBar.lastElementChild;
    let lastLinkPara = lastLink.lastElementChild;
    if (localStorage.getItem("currentUser") == "null") {
        if (!window.location.pathname == "login.html") {
            lastLink.href = "signup.html";
            lastLinkPara.innerText = "Sign Up";
        } 
    }
    else {
        lastLink.href = "profile.html";
        lastLinkPara.innerText = "Profile";
    }
}

if (window.location.pathname.includes("index.html")) {
    let userCount = 0;
    let userCountDiv = document.getElementsByClassName("user-count")[0];
    let timer = setInterval(function() {
        userCountDiv.innerText = userCount.toLocaleString() + " Users";
        userCount += 5000;
        if (userCount > 1000000) {
            clearInterval(timer);
        }
    }, 10);
}