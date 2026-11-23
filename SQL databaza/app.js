
const ulozenaTema = localStorage.getItem('theme');
if (ulozenaTema === 'light') {
    document.body.classList.add('light-mode');
}

function aktualizujPrepinaceTemy() {
    const jeTmavyRezim = !document.body.classList.contains('light-mode');
    document.querySelectorAll('.theme-toggle').forEach(button => {
        button.textContent = jeTmavyRezim ? 'Zapnúť svetlý režim' : 'Zapnúť tmavý režim';
        button.setAttribute('aria-pressed', String(!jeTmavyRezim));
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

fetch('/topbar.html')
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

fetch('/footer.html')
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
