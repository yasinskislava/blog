import Handlebars from "handlebars";

export default async function renderComments(a ,b) {
    const comment = document.querySelectorAll("#comment");
    for (let i = a; i < b; i++) {
        if (i > comment.length - 1) {
            return;
        }
        const commentsBox = comment[i].closest(".main-posts > li").querySelector(".comments");
        fetch(`http://localhost:3000/posts/${comment[i].closest(".main-posts > li").id}`).then(value => value.json()).then(value => {
            commentsBox.innerHTML = "";
            for (let j = value.comments.length - 1; j > value.comments.length - 3; j--){
                if (j < 0) {
                    return
                }
                const commentTemplate = `
                <li>
                    <div class="comment-data">
                        <img src="http://localhost:1234/icon.d5de67d9.png" />
                        <b>{{name}} {{surname}}</b>
                    </div>
                    <p>{{comment}}</p>
                </li>`;
                const templateRender = Handlebars.compile(commentTemplate);
                commentsBox.insertAdjacentHTML("beforeend", templateRender(value.comments[j]));
            }
            
            
        });
    }
}
