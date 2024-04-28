import * as basicLightbox from "basiclightbox";
import {
  alert,
  error,
  defaultModules,
} from "../../node_modules/@pnotify/core/dist/PNotify.js";
import * as PNotifyMobile from "../../node_modules/@pnotify/mobile/dist/PNotifyMobile.js";

defaultModules.set(PNotifyMobile, {});

export default function editPost() {
  const edit = document.querySelectorAll("#edit");
  for (let i = (globalThis.page - 1) * 3; i < globalThis.page * 3; i++) {
    if (i > edit.length - 1) {
      return;
    }
    edit[i].addEventListener("click", (e) => {
      if (
        document.querySelector(".main-postfield b").textContent !==
          e.target.closest(".main-posts > li").querySelector("b").textContent
          && document.querySelector(".main-postfield b").textContent !== "-- --"
      ) {
        error({ text: "You do not have permission to edit this message!" });
      } else {
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
                  editPostButton.parentElement.querySelector("textarea").value
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
      }
    });
  }
}
