
// API base URL
const API_URL = "https://localhost:7006/api"

// Post lists
let allPosts = [];
let myPosts = [];

// -----------------------
// Get all post function
// -----------------------

const getAllPost = async function () {
    // Sent GET request to '/post'
    await fetch(`${API_URL}/post`, {
        headers: {
            // Set request header with authentication JWT token
            "Authorization": `Bearer ${getCookieValue('token')}`
        }
    })
        .then(response => {
            if (response.ok) {
                // If response status 200 then convert response to JSON format
                return response.json()
            } else {
                // If response status NOT 200 then throw error code for DOM to catch it 
                throw response.status
            }
        })
        .then(data => allPosts = data) // Save post data to post's array
}

// -----------------------
// Get my post function
// -----------------------

const getMyPost = async () => {
    await fetch(`${API_URL}/post/user`, {
        headers: {
            "Authorization": `Bearer ${getCookieValue('token')}`
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw response.status
            }
        })
        .then(data => myPosts = data)

    return true
}

// -----------------------
// Login function
// -----------------------

const login = async function (userLogin) {
    // Sent POST request to '/login'
    return await fetch(`${API_URL}/login`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: userLogin // Set request body with user credential
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw response.status
            }
        })
        .then(data => {
            if (data.token) {
                // If API return token, then save it to cookies
                setLoginCookie(data)
                return true
            }
        })
}

// -----------------------
// Logout function
// -----------------------

const logout = function () {
    // Remove all user info from cookies
    document.cookie = `token=; expires=; path=/`
    document.cookie = `username=; expires=; path=/`
    document.cookie = `userId=; expires=; path=/`
}

// -----------------------
// Sign up function
// -----------------------

const signUp = async function (userLogin) {
    return await fetch(`${API_URL}/register`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: userLogin,
        })
        .then(response => {
            if (response.ok) {
                return true
            } else {
                throw response.status
            }
        })
}

// -----------------------
// Add post function
// -----------------------

const addPost = async function (postContent) {
    return await fetch(`${API_URL}/post`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${getCookieValue('token')}`
            },
            body: postContent
        })
        .then(response => {
            if (response.ok) {
                return true
            } else {
                throw response.status
            }
        })
}

// -----------------------
// Delete post function
// -----------------------

const deletePost = async function (postId) {
    return await fetch(`${API_URL}/post/${postId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${getCookieValue('token')}`
            }
        })
        .then(response => {
            if (response.ok) {
                return true
            } else {
                throw response.status
            }
        })
}

// -----------------------
// Like post function
// -----------------------

const updateLikePost = async function (postId) {
    return await fetch(`${API_URL}/post/${postId}/like`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${getCookieValue('token')}`
            }
        })
        .then(response => {
            if (response.ok) {
                return true
            } else {
                throw response.status
            }
        })
}

// -----------------------
// Save login cookie function
// -----------------------

const setLoginCookie = function (cookie) {
    // Set token expired time to cookies in Date data type
    const expiredTime = new Date();
    expiredTime.setTime(expiredTime.getTime() + (cookie.expiredTime * 60 * 1000));

    document.cookie = `token=${cookie.token}; expires=${expiredTime}; path=/`
    document.cookie = `username=${cookie.username}; expires=${expiredTime}; path=/`
    document.cookie = `userId=${cookie.userId}; expires=${expiredTime}; path=/`
}