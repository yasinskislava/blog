import activation from "./js/buttons.js";
import renderPosts from "./js/renderPosts.js";
import login from "./js/login.js";
import addPost from "./js/addPost.js";
activation();
renderPosts();
login();
addPost();



const intersectionObserver = new IntersectionObserver((entries) => {
  if (entries[0].intersectionRatio <= 0) return;
    globalThis.page++;
    renderPosts();
});
intersectionObserver.observe(document.querySelector(".infinity"));