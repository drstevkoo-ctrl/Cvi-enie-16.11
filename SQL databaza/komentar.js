const form = document.getElementById('commentForm');
const message = document.getElementById('formMessage');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    // Zobrazí potvrdenie, že komentár bol odoslaný.
    // Text je viditeľný pre všetkých; status región ho oznámi aj čítačke obrazovky.
    message.textContent = 'Komentár bol odoslaný.';
    form.reset();
});
