export default function activation() {
    const links = document.querySelectorAll(".main-list li");
    for (let i of links) {
        i.addEventListener("click", () => {
            for (let j of links) {
                j.classList.remove("active");
            }
            i.classList.add("active");
        })
    }
}