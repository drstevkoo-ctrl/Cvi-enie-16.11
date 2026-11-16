
const ulozenaTema = localStorage.getItem('theme');
if (ulozenaTema === 'light') {
    document.body.classList.add('light-mode');
}

function aktualizujPrepinaceTemy() {
    const jeTmavyRezim = !document.body.classList.contains('light-mode');
    document.querySelectorAll('.theme-toggle').forEach(button => {
        button.textContent = jeTmavyRezim ? 'Zapnúť svetlý režim' : 'Zapnúť tmavý režim';
        button.setAttribute('aria-pressed', String(jeTmavyRezim));
    });
}

function nastavTemu(svetlyRezim) {
    document.body.classList.toggle('light-mode', svetlyRezim);
    localStorage.setItem('theme', svetlyRezim ? 'light' : 'dark');
    aktualizujPrepinaceTemy();

    const toggleMessage = document.getElementById('toggleMessage');
    if (toggleMessage) {
        toggleMessage.textContent = svetlyRezim ? 'Svetlý režim je zapnutý.' : 'Tmavý režim je zapnutý.';
    }
}

fetch('topbar.html')
    .then(response => response.text())
    .then(html => {
       document.body.insertAdjacentHTML('afterbegin', html);
       document.querySelectorAll('.theme-toggle').forEach(button => {
           button.addEventListener('click', () => {
               nastavTemu(!document.body.classList.contains('light-mode'));
           });
       });
       aktualizujPrepinaceTemy();

       const currentPage = window.location.pathname.split('/').pop() || 'index.html';
       const currentLink = Array.from(document.querySelectorAll('.topbar a'))
           .find(link => link.getAttribute('href') === currentPage);
       if (currentLink) {
           currentLink.setAttribute('aria-current', 'page');
       }

    })
    .catch(error => {
        console.error('Nepodarilo sa načítať navigáciu stránky.', error);
    });

fetch('footer.html')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
    })
    .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
        document.getElementById('footerYear').textContent = new Date().getFullYear();
    })
    .catch(error => {
        console.error('Nepodarilo sa načítať pätu stránky.', error);
    });

const button = document.getElementById('changeButton');
const message = document.getElementById('greeting');
const clickMessages = [
    'Ahoj, svet!',
    'Vitaj na stránke!',
    'Dnes je skvelý deň na učenie.',
    'Pokračuj, ide ti to výborne!',
    'Webová stránka ožíva!'
];
let clickMessageIndex = 0;

if (button && message) {
    button.addEventListener('click', () => {
        clickMessageIndex = (clickMessageIndex + 1) % clickMessages.length;
        message.textContent = clickMessages[clickMessageIndex];
    });
}

const toggleMessage = document.getElementById('toggleMessage');
const resetButton = document.getElementById('resetButton');
if (resetButton) {
    resetButton.addEventListener('click', () => {
        clickMessageIndex = 0;
        if (message) {
            message.textContent = clickMessages[clickMessageIndex];
        }
        if (toggleMessage) {
            toggleMessage.textContent = '';
        }
        nastavTemu(false);
        localStorage.removeItem('theme');
    });
}

// Získa polia formulára pomocou ich ID.
const fname = document.getElementById('fname');
const form = document.getElementById('signupForm');
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
if (form && fname && email && course && note && beginner && intermediate && advanced &&
    previewName && previewEmail && previewCourse && previewLevel && previewNote) {
    // Zastaví obnovenie stránky pri odoslaní formulára.
    form.addEventListener('submit', function(event) {
        event.preventDefault();
    });

    fname.addEventListener('input', updatePreview);
    email.addEventListener('input', updatePreview);
    note.addEventListener('input', updatePreview);
    course.addEventListener('change', updatePreview);
    beginner.addEventListener('change', updatePreview);
    intermediate.addEventListener('change', updatePreview);
    advanced.addEventListener('change', updatePreview);
}
