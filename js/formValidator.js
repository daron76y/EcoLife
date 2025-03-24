//if the local storage is empty, initialize the items
if (!(localStorage && localStorage.getItem("localUsersList"))) {
    localStorage.setItem("localUsersList", JSON.stringify([]));
}
if (!(localStorage && localStorage.getItem("currentUser"))) {
    localStorage.setItem("currentUser", JSON.stringify(null));
}

// form validation
let form = document.getElementById("signup-form");
let usernameInput = document.getElementById("signup-username");
let emailInput = document.getElementById("signup-email");
let confirmEmailInput = document.getElementById("signup-confirm-email");
let passwordInput = document.getElementById("signup-password");
let confirmPasswordInput = document.getElementById("signup-confirm-password");
let birthdateInput = document.getElementById("birthdate");
let errorMessagesParagraph = document.querySelector(".contact-form .errorMessages");

let errorMessageList = [];
let passwordStrength = 0;

passwordInput.addEventListener("input", function() {
    //evaluate password strength
    passwordStrength = 0;
    let password = passwordInput.value;
    if (password.length >= 7) {
        passwordStrength ++;
    }
    if (/[a-z]|[A-Z]/.test(password)) {
        passwordStrength ++;
    }
    if (/[0-9]/.test(password)) {
        passwordStrength ++;
    }
    //update color based on strength
    if (passwordStrength <= 1) {
        passwordInput.style.borderColor = "red";
    }
    else if (passwordStrength == 2) {
        passwordInput.style.borderColor = "yellow";
    }
    else if (passwordStrength >= 3) {
        passwordInput.style.borderColor = "lime";
    }
});

passwordInput.addEventListener("keydown", function(e) {
    if (e.key === " ") {
        e.preventDefault();
    }
});
try {
    confirmPasswordInput.addEventListener("keydown", function(e) {
        if (e.key === " ") {
            e.preventDefault();
        }
    });
} catch(error) {
    console.log("no confirm password input exists");
}


form.addEventListener("submit", function(e) {
    e.preventDefault();
    writeErrorMessageParagraph(false);  
    errorMessagesParagraph.innerHTML = "";
    if (usernameInput != null) {
        //username input exists, thus this is the signup page
        validateSignupInput();
    }   
    else {
        //username input does not exist, thus this is the login page
        validateLoginInput();
    }

    if (errorMessageList.length > 0) {
        writeErrorMessageParagraph(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    else {
        if (usernameInput != null) {
            registerNewUser();
            window.location.assign("login.html");
        }
        else {
            window.location.assign("profile.html");
        }
    }
});

function validateSignupInput() {
    // validate email
    if (emailInput.value !== confirmEmailInput.value) {
        addError("Email does not match");
    }
    else {
        removeError("Email does not match");
    }

    // validate password
    if (passwordInput.value !== confirmPasswordInput.value) {
        addError("Password does not match");
    }
    else {
        removeError("Password does not match")
    }
    let validPassword = true;
    for (let i = 0; i < passwordInput.value.length; i++) {
        let regex = /[A-Z]|[a-z]|[0-9]|!|\?/;
        if (!regex.test(passwordInput.value[i])) {
            validPassword = false;
            break;
        }
    }
    if (!validPassword) {
        addError("Password must only contain letters, numbers, !, and ?");
    }
    else {
        removeError("Password must only contain letters, numbers, !, and ?");
    }
    if (passwordStrength < 3) {
        addError("Password too weak");
    }
    else {
        removeError("Password too weak");
    }

    // validate age is 14+
    let birthdate = Date.parse(birthdateInput.value);
    let age = new Date(new Date() - birthdate).getFullYear() - 1970;
    if (age < 14) {
        addError("You must be 14 or older to sign up");
    }
    else {
        removeError("You must be 14 or older to sign up");
    }

    // validate email and username not already taken
    let localUsersList = JSON.parse(localStorage.getItem("localUsersList"));
    localUsersList.forEach(element => {
        if (element.email === emailInput.value) {
            addError("Email already taken");
        }
        else {
            removeError("Email already taken");
        }
        if (element.username === usernameInput.value) {
            addError("Username already taken");
        }
        else {
            removeError("Username already taken");
        }
    });

    // validate username is not "null"
    if (usernameInput.value === "null") {
        addError("'null' cannot be a username");
    }
    else {
        removeError("'null' cannot be a username");
    }
}

function validateLoginInput() {
    //TODO: add validate login input
    let localUsersList = JSON.parse(localStorage.getItem("localUsersList"));
    let thisUser = null;
    localUsersList.forEach(element => {
        if (element.email === emailInput.value && element.password === passwordInput.value) {
            thisUser = element.username;
        }
    });
    localStorage.setItem("currentUser", thisUser);
    if (thisUser == null) {
        addError("Incorrect Credentials");
    }
    else {
        removeError("Incorrect Credentials");
        window.location.assign("https://www.w3schools.com");
    }
    
}

function writeErrorMessageParagraph(write) {
    if (write) {
        errorMessagesParagraph.innerHTML = errorMessageList.join(". ") + ".";
    }
    else {
        errorMessagesParagraph.innerHTML = "";
    }
}

function addError(message) {
    if (!errorMessageList.includes(message)) {
        errorMessageList.push(message);
    }
}

function removeError(message) {
    errorMessageList = errorMessageList.filter(item => item !== message);
}

function registerNewUser() {
    let newUser = {
        username: usernameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        birthday: birthdateInput.value,
        posts: [],
        liked: [],
        pfp: null,
        score: 0
    }

    let localUsersList = JSON.parse(localStorage.getItem("localUsersList"));
    localUsersList.push(newUser);
    localStorage.setItem("localUsersList", JSON.stringify(localUsersList));
}

