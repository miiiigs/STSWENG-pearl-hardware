const title = document.querySelector('#title');

title.addEventListener('click', async (e) => {
    e.preventDefault();

    window.location.href = '/';
})