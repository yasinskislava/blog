import {
  alert,
  error,
  defaultModules,
} from "../../node_modules/@pnotify/core/dist/PNotify.js";
import * as PNotifyMobile from "../../node_modules/@pnotify/mobile/dist/PNotifyMobile.js";
import Handlebars from "handlebars";
import * as basicLightbox from "basiclightbox";
import renderComments from "./renderComments.js";

defaultModules.set(PNotifyMobile, {});
const template = `<li>
            <div class="data">
              <img src="http://localhost:1234/icon.d5de67d9.png" />
              <b>{{name}} {{surname}}</b>
            </div>
            <p>{{text}}</p>
            <ul class="hiddenInfo">
              <li>{{date}}</li>
              <li id="comment"><svg><use href="http://localhost:1234/symbol-defs.a8b2e413.svg#comment"></use></svg></li>
              <li id="edit"><svg><use href="http://localhost:1234/symbol-defs.a8b2e413.svg#edit"></use></svg></li>
              <li id="delete"><svg><use href="http://localhost:1234/symbol-defs.a8b2e413.svg#delete"></use></svg></li>
            </ul>
            <ul class="comments">
            </ul>
          </li>`;
const templateRender = Handlebars.compile(template);

export default function addPost() {
  const postButton = document.querySelector(".main-postfield button");
  postButton.addEventListener("click", async () => {
    let check = true;
    const username = document.querySelector(
      ".main-postfield .data b"
    ).textContent;
    const text = document.querySelector(".main-postfield textarea").value;
    if (username === "User") {
      alert({ text: "To interact with website you need to be signed in!" });
      check = false;
    }
    if (text.trim().length < 5) {
      alert({ text: "To post field must contain at least 5 characters!" });
      check = false;
    }
    if (check) {
      const now = Date.now();
      const info = {
        name: `${username.split(" ")[0]}`,
        surname: `${username.split(" ")[1]}`,
        text: `${text}`,
        date: `${new Date(now).getDate()}/${
          new Date(now).getMonth() + 1
        }/${new Date(now).getFullYear()}  ${normalizeTime(
          new Date(now).getHours(),
          new Date(now).getMinutes()
              )}`,
        comments: []
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      };
      await fetch("http://localhost:3000/posts", options);
      const posts = document.querySelector(".main-posts");
      posts.insertAdjacentHTML("afterbegin", templateRender(info));
      const remove = document.querySelector("#delete");
      await fetch("http://localhost:3000/posts")
        .then((value) => value.json())
        .then((value) => {
          remove.closest(".main-posts > li").id = value[value.length - 1].id;
        });
        remove.addEventListener("click", async (e) => {
          e.target.closest(".main-posts > li").classList.add("hidden");
        setTimeout(() => {
          fetch(`http://localhost:3000/posts/${e.target.closest(".main-posts > li").id}`,{ method: "DELETE" });
          posts.removeChild(e.target.closest(".main-posts > li"));
        }, 700);
        });
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const edit = document.querySelector("#edit");
          edit.addEventListener("click", (e) => {
            const fullName =
              e.target.closest(".main-posts > li").firstElementChild
                .lastElementChild.textContent;
            const currentText = e.target
              .closest(".main-posts > li")
              .querySelector("p").textContent;
            const editPostModal = basicLightbox.create(`
    <div class="editPost">
        <div class="data">
              <img src="http://localhost:1234/icon.d5de67d9.png" />
              <b>${fullName}</b>
            </div>
            <textarea rows="5" placeholder="Type something...">${currentText}</textarea>
            <button>Edit</button>
    </div>
`);
            editPostModal.show();
            setTimeout(() => {
              const editPostButton = document.querySelector(".editPost button");
              editPostButton.addEventListener("click", () => {
                if (
                  editPostButton.parentElement
                    .querySelector("textarea")
                    .value.trim().length < 5
                ) {
                  alert({
                    text: "To post field must contain at least 5 characters!",
                  });
                } else {
                  const info = {
                    text: `${
                      editPostButton.parentElement.querySelector("textarea")
                        .value
                    }`,
                  };

                  const options = {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(info),
                  };
                  fetch(
                    `http://localhost:3000/posts/${
                      e.target.closest(".main-posts > li").id
                    }`,
                    options
                  );
                  e.target
                    .closest(".main-posts > li")
                    .querySelector("p").textContent = info.text;
                  editPostModal.close();
                }
              });
            }, 300);
          });
        
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const commentButton = document.querySelector("#comment");
      
        commentButton.addEventListener("click", (e) => {
          if (
            document.querySelector(".main-postfield b").textContent === "User"
          ) {
            error({ text: "You need to be signed in to leave a comment!" });
            return;
          }
          const fullName =
            document.querySelector(".main-postfield b").textContent;
          const commentModal = basicLightbox.create(`
    <div class="editPost">
        <div class="data">
              <img src="http://localhost:1234/icon.d5de67d9.png" />
              <b>${fullName}</b>
            </div>
            <textarea rows="5" placeholder="Type something..."></textarea>
            <button id="leaveComment">Send</button>
    </div>
`);
          commentModal.show();
          setTimeout(() => {
            const trigger = document.getElementById("leaveComment");
            trigger.addEventListener("click", async () => {
              const comment = document.querySelector(".editPost textarea");
              if (comment.value.trim() === "") {
                alert({ text: "Form must not contain empty fields!" });
                return;
              }
              const now = Date.now();
              const info = {
                name: document
                  .querySelector(".main-postfield b")
                  .textContent.split(" ")[0],
                surname: document
                  .querySelector(".main-postfield b")
                  .textContent.split(" ")[1],
                comment: comment.value,
                creatingDate: `${new Date(now).getDate()}/${
                  new Date(now).getMonth() + 1
                }/${new Date(now).getFullYear()}  ${normalizeTime(
                  new Date(now).getHours(),
                  new Date(now).getMinutes()
                )}`,
              };

              await fetch(
                `http://localhost:3000/posts/${
                  e.target.closest(".main-posts > li").id
                }`
              )
                .then((value) => value.json())
                .then((value) => {
                  const tempArr = value.comments;
                  tempArr.push(info);
                  const options = {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ comments: tempArr }),
                  };
                  fetch(
                    `http://localhost:3000/posts/${
                      e.target.closest(".main-posts > li").id
                    }`,
                    options
                  );
                });
              commentModal.close();
              setTimeout(() => {
                renderComments(0, 1);
                setTimeout(() => {
                  const stylesFix = document.querySelectorAll(".comments");
                  for (let k of stylesFix) {
                    if (k.innerHTML.trim() === "") {
                      k.classList.remove("showComment");
                      k.classList.add("hideComment");
                    } else {
                      k.classList.remove("hideComment");
                      k.classList.add("showComment");
                    }
                  }
                }, 600);
              }, 500);
            });
          }, 300);
        });
      }
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      document.querySelector(".main-postfield textarea").value = "";
    
  });
}

function normalizeTime(hours, mins) {
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (mins < 10) {
    mins = "0" + mins;
  }
  return `${hours}:${mins}`;
}
