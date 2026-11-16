
// Získa polia formulára pomocou ich ID.
const form = document.getElementById('signupForm');
const fname = document.getElementById('fname');
const email = document.getElementById('email');
const course = document.getElementById('course');
const note = document.getElementById('note');
const beginner = document.getElementById('beginner');
const intermediate = document.getElementById('intermediate');
const advanced = document.getElementById('advanced');

// Získa miesta, do ktorých sa vypisuje náhľad.
const previewName = document.getElementById('previewName');
const previewEmail = document.getElementById('previewEmail');
const previewCourse = document.getElementById('previewCourse');
const previewLevel = document.getElementById('previewLevel');
const previewNote = document.getElementById('previewNote');

// Zobrazí aktuálne údaje z formulára v náhľade.
function updatePreview() {
    previewName.textContent = fname.value || '-';
    previewEmail.textContent = email.value || '-';
    previewCourse.textContent = course.options[course.selectedIndex].text;
    previewNote.textContent = note.value || '-';

    if (beginner.checked) {
        previewLevel.textContent = beginner.value;
    } else if (intermediate.checked) {
        previewLevel.textContent = intermediate.value;
    } else if (advanced.checked) {
        previewLevel.textContent = advanced.value;
    } else {
        previewLevel.textContent = '-';
    }
}

// Pri písaní a výbere možností aktualizuje náhľad.
fname.addEventListener('input', updatePreview);
email.addEventListener('input', updatePreview);
note.addEventListener('input', updatePreview);
course.addEventListener('change', updatePreview);
beginner.addEventListener('change', updatePreview);
intermediate.addEventListener('change', updatePreview);
advanced.addEventListener('change', updatePreview);

// Zabráni odoslaniu na server, skryje formulár a zobrazí správu.
form.addEventListener('submit', function(event) {
    event.preventDefault();
    form.style.display = 'none';
    alert('Formulár bol úspešne odoslaný.');
});