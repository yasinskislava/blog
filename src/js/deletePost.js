import {
  error,
  defaultModules,
} from "../../node_modules/@pnotify/core/dist/PNotify.js";
import * as PNotifyMobile from "../../node_modules/@pnotify/mobile/dist/PNotifyMobile.js";

defaultModules.set(PNotifyMobile, {});

export default function deletePost() {
    const remove = document.querySelectorAll("#delete");
    for (let i = (globalThis.page - 1) * 3; i < (globalThis.page * 3); i++) {
        if (i > remove.length - 1) {
            return;
        }        
        remove[i].addEventListener("click", (e) => {
          if (document.querySelector(".main-postfield b").textContent !== e.target.closest(".main-posts > li").querySelector("b").textContent && document.querySelector(".main-postfield b").textContent !== "-- --") {
              error({text: "You do not have permission to delete this message!"});
          }
          else {
            e.target.closest(".main-posts > li").classList.add("hidden");
            setTimeout(() => {
                fetch(`http://localhost:3000/posts/${e.target.closest(".main-posts > li").id}`, { method: "DELETE" });
                const posts = document.querySelector(".main-posts");
                posts.removeChild(e.target.closest(".main-posts > li"));
            }, 700);  
          }
        
        
    });
  }
}


