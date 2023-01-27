
const navLinks = document.querySelectorAll(".nav-link");
const navTab = document.querySelector(".nav-pills");

const postContainer = document.querySelectorAll(".post-section");
const allPostContainer = document.querySelector("#AllPost");
const myPostContainer = document.querySelector("#MyPost");

const activeUser = document.querySelector("#ActiveUser")
const logoutBtn = document.querySelector("#Logout")

const SignUpModal = new bootstrap.Modal('#SignModal')
const LoginModal = new bootstrap.Modal('#LoginModal')

const signForm = document.querySelector("#SignForm");
const loginForm = document.querySelector("#LoginForm");

const SignUpEmail = document.querySelector("#SignUpEmail");
const SignUpUsername = document.querySelector("#SignUpUsername");
const SignUpPassword = document.querySelector("#SignUpPassword");

const LoginEmail = document.querySelector("#LoginEmail");
const LoginPassword = document.querySelector("#LoginPassword");
const loginSpinner = document.querySelector(".login-spinner")

const signUpBtn = document.querySelector("#SignUpBtn")

const postLoading = document.querySelector(".post-loading")

const addPostBtn = document.querySelector("#AddButton");
const postModal = new bootstrap.Modal('#PostModal')
const postForm = document.querySelector("#PostForm")

const postTitle = document.querySelector("#PostTitle");
const postBody = document.querySelector("#PostBody");

const deleteModal = new bootstrap.Modal("#DeleteModal")
const confirmDelBtn = document.querySelector('#ConfirmDelBtn')

// -----------------------
// Get currently stored cookies
// -----------------------

const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

// -----------------------
// Check stored token's cookie and render username
// -----------------------

const checkAccountValidation = function () {
    if (getCookieValue("token")) {
        logoutBtn.classList.remove("visually-hidden")
        activeUser.classList.remove("visually-hidden")
        activeUser.textContent = getCookieValue("username")
        return true;
    } else {
        logoutBtn.classList.add("visually-hidden")
        activeUser.classList.add("visually-hidden")
        return false
    }
}

// -----------------------
// Switching tab function
// -----------------------

const switchTab = function (e) {
    const clicked = e.target.closest(".nav-link")

    navLinks.forEach(nav => nav.classList.remove("active"));
    clicked.classList.add("active");

    postContainer.forEach(container => container.classList.add("d-none"))
    document.querySelector(`#${clicked.dataset.tab}`).classList.remove("d-none");
}

// -----------------------
// Create post card element
// -----------------------

const createPostElement = function (post) {
    const { postID, title, body, likesNumber, userID, userName, datetime } = post;

    // Format date
    const newDatetime = new Date(datetime)
    const formattedDate = new Intl.DateTimeFormat('en-US').format(newDatetime);

    // Get login user ID
    const currentUserID = getCookieValue("userId");

    // Create delete button separately and render only when the currently signed user is post's owner
    const deleteBtn = `<button class="btn-delete" data-bs-toggle="modal" data-bs-target="#DeleteModal" data-bs-id="${postID}" data-bs-title="${title}">
        <i class="bi bi-trash-fill text-danger"></i>
    </button>`

    return `
    <div class="post card mb-2">
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${body}</p>
        </div>
        <div class="card-footer">
            <small class="text-muted">${userName} - ${formattedDate}</small>
            <div class="float-end d-flex align-items-center">
                <button class="btn-like" onclick="likePost(${postID})">
                    <small class="badge bg-primary text-light">${likesNumber}</small>
                    <i class="bi bi-heart text-primary"></i>
                </button>
                ${currentUserID == userID ? deleteBtn : ""}
            </div>
        </div>
    </div>
    `
}

// -----------------------
// Create error message
// -----------------------

const createErrorMessage = function (message, parentElement) {
    const errorElement = `<div class="alert alert-danger py-2 px-3" id="LoginError" role="alert">
        <small>${message}</small>
    </div>`

    // Render message to the beginning of parent element
    parentElement.insertAdjacentHTML("afterbegin", errorElement)
}

// -----------------------
// Create loading spinner
// -----------------------

const createLoadingSpinner = function (parentElement) {
    const errorElement = `<div class="text-center p-3 post-loading">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>`

    // Render message to the beginning of parent element
    parentElement.insertAdjacentHTML("afterbegin", errorElement)
}

// -----------------------
// Render all posts
// -----------------------

const renderAllPost = async function () {
    try {
        // Display loading...
        createLoadingSpinner(allPostContainer);

        // Check stored user data in cookies
        checkAccountValidation();

        // Retrieve post from API
        await getAllPost();
        await getMyPost();

        // Clear all post section content
        allPostContainer.innerHTML = "";
        myPostContainer.innerHTML = "";

        // Render posts to interface
        allPosts.forEach(post => {
            const postElement = createPostElement(post);
            allPostContainer.insertAdjacentHTML("beforeend", postElement)
        })

        myPosts.forEach(post => {
            const postElement = createPostElement(post);
            myPostContainer.insertAdjacentHTML("beforeend", postElement)
        })
    } catch (error) {
        if (error == 401) {
            // If API return 401 (Unauthorized) then show login form
            LoginModal.show()
        }
    }
}

// -----------------------
// Login form function
// -----------------------

loginForm.addEventListener("submit", async e => {
    // Display loading spinner
    loginSpinner.classList.remove("visually-hidden")

    e.preventDefault();

    // If there is error message then remove it
    document.querySelector("#LoginError")?.remove();

    try {
        // Create login credential object
        const userLogin = {
            Password: LoginPassword.value,
            Email: LoginEmail.value
        }

        // Sent login credential to API, if it return TRUE, then close login form
        if (await login(JSON.stringify(userLogin))) LoginModal.hide();

        loginSpinner.classList.add("visually-hidden")
        renderAllPost();
    } catch (error) {
        if (error == 401) {
            // If API return 401 (Unauthorized) then show error message on login form
            createErrorMessage("Please login with correct account.", loginForm)
        }
    }
})

logoutBtn.addEventListener("click", e => {
    allPostContainer.innerHTML = "";
    myPostContainer.innerHTML = "";

    // Remove user's token from cookies
    logout();

    // Re-render post to check user's token validation
    renderAllPost();
})

// -----------------------
// Sign Up form function
// -----------------------

signUpBtn.addEventListener("click", () => SignUpModal.show())

signForm.addEventListener("submit", async e => {

    e.preventDefault();

    try {
        // Create user credential object
        const userSign = {
            Password: SignUpPassword.value,
            Username: SignUpUsername.value,
            Email: SignUpEmail.value
        }

        // Sent user credential to API, if it return TRUE, then close sign up form
        if (await signUp(JSON.stringify(userSign))) SignUpModal.hide();

    } catch (error) {
        if (error == 401) {
            // If API return 401 (Unauthorized) then show error message on login form
            createErrorMessage("Please sign up with correct account.", signForm)
        }
    }
})

// -----------------------
// Sign Up form function
// -----------------------

postForm.addEventListener("submit", async e => {
    e.preventDefault();

    try {
        const postContent = {
            Title: postTitle.value,
            Body: postBody.value
        }

        if (await addPost(JSON.stringify(postContent))) postModal.hide();

        renderAllPost();
    } catch (error) {
        if (error == 401) {
            logout()
            renderAllPost();
        }
    }

    postForm.reset();
})

// -----------------------
// Delete's modal function
// -----------------------

deleteModal._element.addEventListener('show.bs.modal', event => {
    // Get post's delete button
    const button = event.relatedTarget

    // Get post's ID and title from delete button
    const postId = button.getAttribute('data-bs-id')
    const postTitle = button.getAttribute('data-bs-title')

    // Set post's ID to confirm button
    confirmDelBtn.setAttribute("data-id", postId)

    // Set modal header with post's title
    const modalTitle = deleteModal._element.querySelector('.modal-title')
    modalTitle.textContent = `Delete '${postTitle}'?`
})

// Confirm button clicked
confirmDelBtn.addEventListener("click", async (e) => {
    try {
        // Sent delete request to API
        await deletePost(e.target.dataset.id)
        // Hide delet modal
        deleteModal.hide();
        // Re-render all post
        renderAllPost();
    } catch (error) {
        if (error == 401) {
            logout()
            renderAllPost();
        }
    }
})

// -----------------------
// Like post function
// -----------------------

const likePost = async function (postId) {
    // Sent like post request to API, then re-render post
    if (await updateLikePost(postId)) renderAllPost();
}

// -----------------------
// Initialization function
// -----------------------

document.addEventListener("DOMContentLoaded", () => {
    // Set post's tab event listener
    navTab.addEventListener("click", switchTab)
    // Render all post
    renderAllPost();
})