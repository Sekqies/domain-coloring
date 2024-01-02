function changeActiveClass() {
    const radioDivs = document.querySelectorAll("#options .tipo div");
    radioDivs.forEach(div => {
        div.addEventListener("click", () => {
            radioDivs.forEach(div => {
                div.classList.remove("active");
            });
            div.classList.add("active");
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    changeActiveClass();
});
