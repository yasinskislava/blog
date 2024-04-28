import * as basicLightbox from "basiclightbox";
import {
  alert,
  error,
  defaultModules,
  success
} from "../../node_modules/@pnotify/core/dist/PNotify.js";
import * as PNotifyMobile from "../../node_modules/@pnotify/mobile/dist/PNotifyMobile.js";

defaultModules.set(PNotifyMobile, {});

let signInCheck = true;
let signUpCheck = true;

export default function login() {
  const signInModal = basicLightbox.create(`
    <div class="modal">
    <h3>Sign In</h3>
    <ul>
        <li>Username<input type="text"></li>
        <li>Password<input type="text"></li>
    </ul>
    <button>Sign In</button>
</div>
`);

  const signUpModal = basicLightbox.create(`
    <div class="modal">
    <h3>Sign Up</h3>
    <ul>
        <li>Username<input type="text"></li>
        <li>Name<input type="text"></li>
        <li>Surname<input type="text"></li>
        <li>Password<input type="text"></li>
    </ul>
    <button>Sign Up</button>
</div>
`);

  const signUp = document.getElementById("signUp");
  const signIn = document.getElementById("signIn");
  signUp.addEventListener("click", () => {
    signUpModal.show();
    const trigger = document.querySelector(".modal > button");
    const fields = document.querySelectorAll(".modal input");
    if (signUpCheck) {
      signUpCheck = false;
      trigger.addEventListener("click", async () => {
        let check = true;
        for (let i of fields) {
          check = true;
          if (i.value.trim().length === 0) {
            check = false;
            alert({
              text: "Form must not contain empty fields!",
            });
            return;
          }
        }

        if (check) {
          const now = Date.now();
          const info = {
            username: fields[0].value.trim(),
            name: fields[1].value.trim(),
            surname: fields[2].value.trim(),
            password: fields[3].value.trim(),
            date: `${new Date(now).getDate()}/${
              new Date(now).getMonth() + 1
            }/${new Date(now).getFullYear()}`,
          };
          signUpModal.close();
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(info),
          };
          for (let i of fields) {
            i.value = "";
          }
            await fetch("http://localhost:3000/login", options);
            success({text: "You successfully signed up!"});
        }
      });
    }
  });

  signIn.addEventListener("click", () => {
    signInModal.show();
    const trigger = document.querySelector(".modal > button");
    const fields = document.querySelectorAll(".modal input");
    if (signInCheck) {
      signInCheck = false;
      trigger.addEventListener("click", async () => {
        let check = true;
        for (let i of fields) {
          check = true;
          if (i.value.trim().length === 0) {
            check = false;
            alert({
              text: "Form must not contain empty fields!",
            });
            return;
          }
        }
          
        if (check) {
          let obj = "";
          await fetch("http://localhost:3000/login")
            .then((value) => value.json())
            .then((value) => {
              for (let i of value) {
                if (
                  i.username === fields[0].value.trim() &&
                  i.password === fields[1].value.trim()
                ) {
                  obj = i;
                }
              }
             
              if (obj === "") {
                error({ text: "Username or password is incorrect!" });
              } else {
                localStorage.setItem("info", JSON.stringify(obj));
                const profile = document.querySelector(".info");
                const loggedOut = document.getElementById("loggedOut");
                loggedOut.style.display = "none";
                profile.insertAdjacentHTML(
                  "beforeend",
                  `
              <div id="showInfo">
              <ul>
                <li><b>Userame:</b> @${obj.username}</li>
                <li><b>Name:</b> ${obj.name}</li>
                <li><b>Surname:</b> ${obj.surname}</li>
                <li><b>Registration date:</b> ${obj.date}</li>
            </ul>
            <button id="logout">Log Out</button>
            </div>
            `
                );
                const user = document.querySelector(".main-postfield .data b");
                user.textContent = `${obj.name} ${obj.surname}`;
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

          signInModal.close();
          for (let i of fields) {
            i.value = "";
            }
            success({ text: "You successfully signed in!" });
        }
      });
    }
  });
}
