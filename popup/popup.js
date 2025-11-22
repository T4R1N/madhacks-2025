
function ButtonClicked() {
    let button = document.getElementById('toggleButton');
    let indication = document.getElementById('indicator');
    let current = button.getAttribute('aria-pressed');

    if (current == 'true') {
        button.setAttribute('aria-pressed', 'false');
        indication.textContent= "Simon IS Listening";
        indication.style.color = "green";
    } else {
        button.setAttribute('aria-pressed', 'true');
        indication.textContent= "Simon is NOT Listening";
        indication.style.color = "red";
    }
}