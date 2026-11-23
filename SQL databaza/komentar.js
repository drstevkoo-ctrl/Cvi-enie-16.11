const commentForm = document.getElementById('commentForm');
const formMessage = document.getElementById('formMessage');

commentForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // Zobrazí potvrdenie, že komentár bol odoslaný.
    // Text je viditeľný pre všetkých; status región ho oznámi aj čítačke obrazovky.
    formMessage.textContent = 'Komentár bol odoslaný.';
    commentForm.reset();
});
