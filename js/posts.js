// render all the posts saved from local storage
if (!(localStorage && localStorage.getItem("postsBoard"))) {
    localStorage.setItem("postsBoard", JSON.stringify([]));
}
else {
    refreshPostsList();
}

function refreshPostsList() {
    let postBoard = document.getElementsByClassName("post-board")[0];
    postBoard.innerHTML = "";
    JSON.parse(localStorage.getItem("postsBoard")).forEach(element => {
        let polaroid = document.createElement("div");
        polaroid.classList.add("polaroid");
        polaroid.innerHTML = `
            <img src="${element.imageSrc}" alt="user post">
            <p class="post-name">
                ${element.postTitle}
            </p>
            <p class="post-user">
                ${element.postUser}
            </p>
            <p class="likes">
                <i class="fa-solid fa-thumbs-up" onclick="likePost(event)"></i>
                <span>${element.likes}</span>
            </p>
        `
        postBoard.appendChild(polaroid);

        if (element.likedBy.includes(localStorage.getItem("currentUser"))) {
            polaroid.lastElementChild.firstElementChild.style.color = "var(--green)";
        }
    });
}

function showInputField(e) {
    let inputFields = document.getElementsByClassName("post-input-field")[0];
    inputFields.classList.toggle("visible-inputs")
    e.target.classList.toggle("active");
}

function rotateBtn(e) {
    if (e.target.style.transform == "rotate(0deg)") {
        e.target.style.transform = "rotate(360deg)";
    }
    else {
        e.target.style.transform = "rotate(0deg)";
    }
}

function postPolaroid() {
    // redirect user to log in if there is no current user
    if (localStorage.getItem("currentUser") == "null") {
        window.location.assign("login.html");
        return;
    }

    let imageFile = document.getElementById("image-input").files[0];
    let postTitle = document.getElementById("postname-input");

    //cancel if post title or image file is empty / invalid (JAVASCRIPT REQUIRED INPUTS)
    if (postTitle.value == "" || postTitle.value == null || imageFile == null) {
        document.getElementById("postBtn").style.borderColor = "red";
        setTimeout(function() {
            document.getElementById("postBtn").style.borderColor = "var(--darkgreen)";
        }, 1000);
        return;
    }

    // construct a new polaroid
    let polaroid = document.createElement("div");
    polaroid.classList.add("polaroid");
    polaroid.innerHTML = `
        <img src="${URL.createObjectURL(imageFile)}" alt="user post">
        <p class="post-name">
            ${postTitle.value}
        </p>
        <p class="post-user">
            ${localStorage.getItem("currentUser")}
        </p>
        <p class="likes">
            <i class="fa-solid fa-thumbs-up" onclick="likePost(event)"></i>
            <span>0</span>
        </p>
    `
    let postBoard = document.getElementsByClassName("post-board")[0];
    postBoard.appendChild(polaroid);

    //save this to the localstorage
    let postsList = JSON.parse(localStorage.getItem("postsBoard"));
    let fr = new FileReader();
    fr.readAsDataURL(imageFile);
    fr.addEventListener("load", function() {
        let encodedImage = fr.result;
        let post = {
            imageSrc: encodedImage,
            postTitle: postTitle.value,
            postUser: localStorage.getItem("currentUser"),
            likes: 0,
            likedBy: []
        }
        postsList.push(post);
        localStorage.setItem("postsBoard", JSON.stringify(postsList));
    });
    window.location.reload();
}

function likePost(e) {
    //cannot like if not signed in
    if (localStorage.getItem("currentUser") == "null") {
        window.location.assign("login.html");
        return;
    }
    // increment the likes count on this polaroid
    let thisPolaroid = e.target.parentElement.parentElement;
    let postsList = JSON.parse(localStorage.getItem("postsBoard"));
    postsList.forEach(element => {
        if (
            thisPolaroid.children[0].src == element.imageSrc &&
            thisPolaroid.children[1].textContent.trim() == element.postTitle &&
            thisPolaroid.children[2].textContent.trim() == element.postUser &&
            !element.likedBy.includes(localStorage.getItem("currentUser"))
        ) {
            element.likes += 1;
            e.target.nextElementSibling.textContent = parseInt(e.target.nextElementSibling.textContent) + 1;
            element.likedBy.push(localStorage.getItem("currentUser"));
            let localUsersList = JSON.parse(localStorage.getItem("localUsersList"));
            localUsersList.forEach(user => {
                if (user.username == element.postUser) {
                    user.score += 1;
                }
            });
            thisPolaroid.lastElementChild.firstElementChild.style.color = "var(--green)";
            localStorage.setItem("localUsersList", JSON.stringify(localUsersList));
        }
    });

    // update the local storage
    localStorage.setItem("postsBoard", JSON.stringify(postsList));
}