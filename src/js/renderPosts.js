import Handlebars from "handlebars";
globalThis.page = 1;

import deletePost from "./deletePost.js";
import editPost from "./editPost.js";
import commentPost from "./commentPost.js";
import renderComments from "./renderComments.js";

export default async function renderPosts() {
  const template = `<li id="{{id}}">
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
            <ul class="comments showComment">
            </ul>
          </li>`;
  const list = document.querySelector(".main-posts");
    const templateRender = Handlebars.compile(template);
  await fetch(`http://localhost:3000/posts`)
    .then((value) => value.json())
      .then((posts) => {
        for (let i = ((posts.length - 1) - ((globalThis.page - 1) * 3)); i > (posts.length - 1) - (globalThis.page * 3);i--) {
            if (i >= 0) {
                list.insertAdjacentHTML("beforeend", templateRender(posts[i]));
            }
          }
          deletePost();
          editPost();
          commentPost();
          renderComments((globalThis.page - 1) * 3, globalThis.page * 3);
          setTimeout(() => {
              const stylesFix = document.querySelectorAll(".comments");
              for (let k of stylesFix) {
                  if (k.innerHTML.trim() === "") {
                      k.classList.remove("showComment");
                      k.classList.add("hideComment");
                  }
                  else {
                      k.classList.remove("hideComment");
                      k.classList.add("showComment");
                  }
              }
          }, 600);
          
    });
}
