import activation from "./js/buttons.js";
import renderPosts from "./js/renderPosts.js";
import login from "./js/login.js";
import addPost from "./js/addPost.js";
activation();
renderPosts();
login();
addPost();


document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("info"));
  if (data !== null) {
    const profile = document.querySelector(".info");
    const loggedOut = document.getElementById("loggedOut");
    loggedOut.style.display = "none";
    profile.insertAdjacentHTML(
      "beforeend",
      `
              <div id="showInfo">
              <ul>
                <li><b>Userame:</b> @${data.username}</li>
                <li><b>Name:</b> ${data.name}</li>
                <li><b>Surname:</b> ${data.surname}</li>
                <li><b>Registration date:</b> ${data.date}</li>
            </ul>
            <button id="logout">Log Out</button>
            </div>
            `
    );
    const user = document.querySelector(".main-postfield .data b");
    user.textContent = `${data.name} ${data.surname}`;
    const logOut = document.getElementById("logout");
    logOut.addEventListener("click", () => {
      localStorage.removeItem("info");
      loggedOut.style.display = "block";
      const profileInfo = document.getElementById("showInfo");
      profile.removeChild(profileInfo);
      user.textContent = `User`;
    });
  }
});


const intersectionObserver = new IntersectionObserver((entries) => {
  if (entries[0].intersectionRatio <= 0) return;
    globalThis.page++;
    renderPosts();
});
intersectionObserver.observe(document.querySelector(".infinity"));