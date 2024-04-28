import {
  error,
    defaultModules,
  alert,success
} from "../../node_modules/@pnotify/core/dist/PNotify.js";
import * as PNotifyMobile from "../../node_modules/@pnotify/mobile/dist/PNotifyMobile.js";
import * as basicLightbox from "basiclightbox";
defaultModules.set(PNotifyMobile, {});
import renderComments from "./renderComments.js";

export default function commentPost() {
  const commentButton = document.querySelectorAll("#comment");
  for (let i = (globalThis.page - 1) * 3; i < globalThis.page * 3; i++) {
    if (i > commentButton.length - 1) {
      return;
    }
      commentButton[i].addEventListener("click", (e) => {
          if (document.querySelector(".main-postfield b").textContent === "User") {
              error({ text: "You need to be signed in to leave a comment!" });
              return;
          }
          const fullName = document.querySelector(".main-postfield b").textContent;
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
                    name: document.querySelector(".main-postfield b").textContent.split(" ")[0],
                    surname: document.querySelector(".main-postfield b").textContent.split(" ")[1],
                    comment: comment.value,
                    creatingDate: `${new Date(now).getDate()}/${
                      new Date(now).getMonth() + 1
                    }/${new Date(now).getFullYear()}  ${normalizeTime(
                      new Date(now).getHours(),
                      new Date(now).getMinutes()
                    )}`,
                  };
                  
                  await fetch(`http://localhost:3000/posts/${e.target.closest(".main-posts > li").id}`).then(value => value.json()).then(value => {
                      const tempArr = value.comments;
                      tempArr.push(info);
                      const options = {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({comments: tempArr}),
                      };
                      fetch(`http://localhost:3000/posts/${e.target.closest(".main-posts > li").id}`, options)
                  });
                  commentModal.close();
                  setTimeout(() => { 
                      renderComments(0, commentButton.length);
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
