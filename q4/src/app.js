// CYSE 411 Exam Application
// WARNING: This code contains security vulnerabilities.
// Students must repair the implementation.

const loadBtn = document.getElementById("loadBtn");
const saveBtn = document.getElementById("saveSession");
const loadSessionBtn = document.getElementById("loadSession");

loadBtn.addEventListener("click", loadProfile);
saveBtn.addEventListener("click", saveSession);
loadSessionBtn.addEventListener("click", loadSession);

let currentProfile = null;


/* -------------------------
   Load Profile
-------------------------- */

function loadProfile() {

    const text = document.getElementById("profileInput").value;
    let parsedData;

    try {
        parsedData = JSON.parse(text);

    } catch (error) {
        alert("Invalid file/parse");
        return;
    }

    if (
        !parsedData ||
        typeof parsedData !== "object" ||
        Array.isArray(parsedData) ||
        typeof parsedData.username !== "string" ||
        !Array.isArray(parsedData.notifications) ||
        !parsedData.notifications.every((item) => typeof item === "string")
    ) {
        alert("Invalid Data! Redo it");
        return;
    }

    const profile = {
        username: parsedData.username,
        notifications: parsedData.notifications
    };

    currentProfile = profile;

    renderProfile(profile);
}


/* -------------------------
   Render Profile
-------------------------- */

function renderProfile(profile) {

    
    document.getElementById("username").textContent = profile.username;

    const list = document.getElementById("notifications");
    list.replaceChildren();

    for (let n of profile.notifications) {

        const li = document.createElement("li");

        
        li.textContent = n;

        list.appendChild(li);
    }
}


/* -------------------------
   Browser Storage
-------------------------- */

function saveSession() {
    if (!currentProfile) {
        return;
    }

    const safeProfile = {
        username: String(currentProfile.username || ""),
        notifications: Array.isArray(currentProfile.notifications)
            ? currentProfile.notifications.filter((item) => typeof item === "string")
            : []
    };

    localStorage.setItem("profile", JSON.stringify(safeProfile));
}


function loadSession() {
    try {
        const stored = localStorage.getItem("profile");
        if (!stored) return;

        const parsed = JSON.parse(stored);

        if (
            typeof parsed !== "object" ||
            parsed === null ||
            Array.isArray(parsed) ||
            typeof parsed.username !== "string" ||
            !Array.isArray(parsed.notifications) ||
            !parsed.notifications.every((item) => typeof item === "string")
        ) {
            throw new Error("Invalid data");
        }

        const validatedProfile = {
            username: parsed.username,
            notifications: parsed.notifications
        };

        currentProfile = validatedProfile;
        renderProfile(validatedProfile);

    } catch (error) {
        localStorage.removeItem("profile");
        currentProfile = null;
    }
}
