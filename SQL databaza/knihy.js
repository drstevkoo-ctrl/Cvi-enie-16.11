const formularik = document.getElementById("formularik");
const zoznamKnihTable = document.getElementById("zoznamKnihTable");
const sprava = document.getElementById("sprava");

function zobrazSpravu(text, jeChyba = false) {
    sprava.textContent = text;
    sprava.classList.toggle("chyba", jeChyba);
}

function nacitajKnihy() {
    const hladat = document.getElementById("hladatInput").value;
    const zoradit = document.getElementById("zoraditSelect").value;
    const smer = document.getElementById("smerSelect").value;

    const params = new URLSearchParams({ hladat, zoradit, smer });

    fetch("/api/knihy?" + params.toString())
    .then(odpoved => odpoved.json())
    .then(knihy => {
        zoznamKnihTable.innerHTML = "";

        knihy.forEach(kniha => {
            const riadok = document.createElement("tr");

            [kniha.id, kniha.nazov, kniha.autor, kniha.rok, kniha.cena].forEach(hodnota => {
                const bunka = document.createElement("td");
                bunka.textContent = hodnota;
                riadok.appendChild(bunka);
            });

            const bunkaAkcie = document.createElement("td");
            const tlacidlo = document.createElement("button");
            tlacidlo.textContent = "Vymazať";
            tlacidlo.type = "button";
            tlacidlo.addEventListener("click", async () => {
                if (!confirm(`Naozaj chceš vymazať knihu „${kniha.nazov}“?`)) {
                    return;
                }

                try {
                    const odpovedMazania = await fetch(
                        `/api/knihy/${encodeURIComponent(kniha.id)}`,
                        { method: "DELETE" }
                    );
                    if (!odpovedMazania.ok) {
                        throw new Error(await odpovedMazania.text());
                    }
                    zobrazSpravu("Kniha bola vymazaná.");
                    await nacitajKnihy();
                } catch (chyba) {
                    zobrazSpravu(chyba.message, true);
                }
            });
            bunkaAkcie.appendChild(tlacidlo);

            const upravitBtn = document.createElement("button");
            upravitBtn.textContent = "Upraviť";
            upravitBtn.type = "button";
            upravitBtn.addEventListener("click", async () => {
                const nazov = prompt("Názov knihy:", kniha.nazov);
                if (nazov === null) return;
                const autor = prompt("Autor:", kniha.autor);
                if (autor === null) return;
                const rok = prompt("Rok vydania:", kniha.rok);
                if (rok === null) return;

                const rokVydania = Number(rok);
                if (!nazov.trim() || !autor.trim() || !Number.isInteger(rokVydania)) {
                    zobrazSpravu("Vyplň názov, autora a platný rok vydania.", true);
                    return;
                }

                try {
                    const odpovedUpravy = await fetch(
                        `/api/knihy/${encodeURIComponent(kniha.id)}`,
                        {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                nazov: nazov.trim(),
                                autor: autor.trim(),
                                rok: rokVydania
                            })
                        }
                    );
                    if (!odpovedUpravy.ok) {
                        throw new Error(await odpovedUpravy.text());
                    }

                    zobrazSpravu(await odpovedUpravy.text());
                    await nacitajKnihy();
                } catch (chyba) {
                    zobrazSpravu(chyba.message, true);
                }
            });
            bunkaAkcie.appendChild(upravitBtn);

            const cenaBtn = document.createElement("button");
            cenaBtn.textContent = "Zmeniť cenu";
            cenaBtn.type = "button";
            cenaBtn.addEventListener("click", async () => {
                const vstup = prompt("O koľko eur chcete zmeniť cenu knihy?", "5");
                if (vstup === null || vstup.trim() === "") return;

                const zmena = Number(vstup.replace(",", "."));
                if (!Number.isFinite(zmena)) {
                    zobrazSpravu("Zmena musí byť číslo.", true);
                    return;
                }

                try {
                    const odpovedZmeny = await fetch(
                        `/api/knihy/${encodeURIComponent(kniha.id)}/cena`,
                        {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ zmena })
                        }
                    );
                    if (!odpovedZmeny.ok) {
                        throw new Error(await odpovedZmeny.text());
                    }

                    zobrazSpravu(await odpovedZmeny.text());
                    await nacitajKnihy();
                } catch (chyba) {
                    zobrazSpravu(chyba.message, true);
                }
            });
            bunkaAkcie.appendChild(cenaBtn);
            riadok.appendChild(bunkaAkcie);
            zoznamKnihTable.appendChild(riadok);
        });
    });
}

formularik.addEventListener("submit", async udalost => {
    udalost.preventDefault();
    const kniha = {
        nazov: document.getElementById("nazov").value,
        autor: document.getElementById("autor").value,
        rok: Number(document.getElementById("rok").value),
        cena: Number(document.getElementById("cena").value)
    };

    try {
        const odpoved = await fetch("/api/knihy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(kniha)
        });
        if (!odpoved.ok) {
            throw new Error(await odpoved.text());
        }

        formularik.reset();
        zobrazSpravu("Kniha bola uložená do databázy.");
        await nacitajKnihy();
    } catch (chyba) {
        zobrazSpravu(chyba.message, true);
    }
});

// Reakcia na zmenu filtra alebo zoradenia.
document.getElementById("hladatInput").addEventListener("input", nacitajKnihy);
document.getElementById("zoraditSelect").addEventListener("change", nacitajKnihy);
document.getElementById("smerSelect").addEventListener("change", nacitajKnihy);

document.getElementById("resetFilterBtn").addEventListener("click", () => {
    document.getElementById("hladatInput").value = "";
    document.getElementById("zoraditSelect").value = "id";
    document.getElementById("smerSelect").value = "ASC";
    nacitajKnihy();
});

// Bonus: zobrazí meno prihláseného používateľa zo sessionStorage.
function zobrazPrihlasenehoPouzivatela() {
    const infoEl = document.getElementById("prihlasenyPouzivatel");
    const ulozeny = sessionStorage.getItem("prihlasenyPouzivatel");

    infoEl.textContent = "";
    if (ulozeny) {
        const pouzivatel = JSON.parse(ulozeny);
        infoEl.textContent = `Prihlásený používateľ: ${pouzivatel.meno}`;
    } else {
        infoEl.textContent = "Nie ste prihlásený. ";
        const odkaz = document.createElement("a");
        odkaz.href = "prihlasenie.html";
        odkaz.textContent = "Prihlásiť sa";
        infoEl.appendChild(odkaz);
    }
}

zobrazPrihlasenehoPouzivatela();
nacitajKnihy();
