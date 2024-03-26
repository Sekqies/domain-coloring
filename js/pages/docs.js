
const voltaraotopo = document.getElementById('voltaraotopo');

document.addEventListener('scroll', function() {
    if(window.scrollY > 100) {
        voltaraotopo.style.opacity = 1;
    }
    else {
        voltaraotopo.style.opacity = 0;
    }
});

voltaraotopo.addEventListener('click', function() {
    window.scrollTo(0, 0);
});