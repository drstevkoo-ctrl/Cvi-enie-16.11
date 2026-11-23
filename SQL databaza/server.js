const express = require('express');
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.json());

// Súbory servera sa nesmú dať otvoriť v prehliadači (napr. /server.js s heslom k databáze).
const skryteSubory = ["/server.js", "/package.json", "/package-lock.json"];
app.use((req, res, next) => {
    if (skryteSubory.includes(req.path) || req.path.startsWith("/node_modules")) {
        return res.status(404).sendFile(__dirname + "/404.html");
    }
    next();
});

app.use(express.static(__dirname));

const db = mysql.createConnection({
    host: "localhost", 
    user: "root",
    password: "",database: "knihy"
});
 db.connect((error) => {
    if (error) console.log("Chyba databazy:",error);
    else console.log("Databaza pripojena");
 });

app.get("/api/knihy", (req, res) => {
    const hladat = (req.query.hladat || "").trim();
    const zoradit = req.query.zoradit || "id";
    const smer = req.query.smer === "DESC" ? "DESC" : "ASC";

    // Whitelist povolenych stlpcov pre ORDER BY (ochrana pred SQL Injection)
    const povoleneStlpce = ["id", "nazov", "autor", "rok", "cena"];
    const stlpec = povoleneStlpce.includes(zoradit) ? zoradit : "id";

    let sql = "SELECT * FROM knihy";
    const parametre = [];

    if (hladat !== "") {
        sql += " WHERE nazov LIKE ? OR autor LIKE ?";
        parametre.push(`%${hladat}%`, `%${hladat}%`);
    }

    sql += ` ORDER BY ${stlpec} ${smer}`;

    db.query(sql, parametre, (error, knihy) => {
        if (error) return res.status(500).send("Chyba SQL");
        res.json(knihy);
    });
});

app.post("/api/knihy", (req, res) => {
    const { nazov, autor, rok, cena } = req.body;
    const sql = "INSERT INTO knihy (nazov, autor, rok, cena) VALUES (?, ?, ?, ?)";
    const rokVydania = Number(rok);
    const cenaKnihy = Number(cena);

    if (typeof nazov !== "string" || !nazov.trim() ||
        typeof autor !== "string" || !autor.trim() ||
        !Number.isInteger(rokVydania) ||
        !Number.isFinite(cenaKnihy)) {
        return res.status(400).send("Vyplň názov, autora, platný rok vydania a cenu.");
    }

    db.query(
        sql,
        [nazov.trim(), autor.trim(), rokVydania, cenaKnihy],
        (error, result) => {
            if (error) {
                console.error("Chyba pri ukladaní knihy:", error);
                return res.status(500).send("Knihu sa nepodarilo uložiť do databázy.");
            }
            res.status(201).json({ id: result.insertId });
        }
    );
});

app.put("/api/knihy/:id", (req, res) => {
    const { nazov, autor, rok } = req.body;
    const rokVydania = Number(rok);

    if (typeof nazov !== "string" || !nazov.trim() ||
        typeof autor !== "string" || !autor.trim() ||
        !Number.isInteger(rokVydania)) {
        return res.status(400).send("Vyplň názov, autora a platný rok vydania.");
    }

    const sql = "UPDATE knihy SET nazov = ?, autor = ?, rok = ? WHERE id = ?";
    db.query(
        sql,
        [nazov.trim(), autor.trim(), rokVydania, req.params.id],
        (error, result) => {
            if (error) {
                console.error("Chyba pri úprave knihy:", error);
                return res.status(500).send("Knihu sa nepodarilo upraviť.");
            }
            if (result.affectedRows === 0) {
                return db.query(
                    "SELECT id FROM knihy WHERE id = ?",
                    [req.params.id],
                    (selectError, rows) => {
                        if (selectError) {
                            console.error("Chyba pri overovaní knihy:", selectError);
                            return res.status(500).send("Knihu sa nepodarilo upraviť.");
                        }
                        if (rows.length === 0) {
                            return res.status(404).send("Kniha sa nenašla.");
                        }
                        res.send("Kniha upravená.");
                    }
                );
            }
            res.send("Kniha upravená.");
        }
    );
});

app.delete("/api/knihy/:id", (req, res) => {
    db.query("DELETE FROM knihy WHERE id = ?", [req.params.id], (error, result) => {
        if (error) {
            console.error("Chyba pri mazaní knihy:", error);
            return res.status(500).send("Knihu sa nepodarilo vymazať.");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Kniha sa nenašla.");
        }
        res.sendStatus(204);
    });
});

app.patch("/api/knihy/:id/cena", (req, res) => {
    const zmena = Number(req.body.zmena);
    if (!Number.isFinite(zmena)) {
        return res.status(400).send("Zmena musí byť číslo.");
    }

    const sql = "UPDATE knihy SET cena = cena + ? WHERE id = ?";
    db.query(sql, [zmena, req.params.id], (error, result) => {
        if (error) {
            return res.status(500).send("Nepodarilo sa aktualizovať cenu knihy.");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Kniha sa nenašla.");
        }
        res.send("cena knihy bola aktualizovaná.");
    });
});

// ---------- Používatelia ----------

// 1. Ziskanie zoznamu pouzivatelov (bez stlpca heslo_hash!)
app.get("/api/pouzivatelia", (req, res) => {
    const sql = "SELECT id, meno, email FROM pouzivatelia ORDER BY id ASC";
    db.query(sql, (error, pouzivatelia) => {
        if (error) return res.status(500).send("Chyba SQL");
        res.json(pouzivatelia);
    });
});

// 2. Registracia noveho pouzivatela s hashovanim hesla
app.post("/api/pouzivatelia", async (req, res) => {
    const { meno, email, heslo } = req.body;

    if (!meno || !email || !heslo) {
        return res.status(400).send("Vyplnte meno, e-mail aj heslo");
    }
    if (heslo.length < 6) {
        return res.status(400).send("Heslo musi mat aspon 6 znakov");
    }

    try {
        const hesloHash = await bcrypt.hash(heslo, 10);
        const sql = "INSERT INTO pouzivatelia (meno, email, heslo_hash) VALUES (?, ?, ?)";
        db.query(sql, [meno.trim(), email.trim(), hesloHash], error => {
            if (error) {
                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).send("Pouzivatel s tymto e-mailom uz existuje");
                }
                return res.status(500).send("Chyba SQL");
            }
            res.status(201).send("Pouzivatel bol uspesne zaregistrovany");
        });
    } catch (err) {
        res.status(500).send("Chyba pri spracovani hesla");
    }
});

// 3. Vymazanie pouzivatela podla ID
app.delete("/api/pouzivatelia/:id", (req, res) => {
    const sql = "DELETE FROM pouzivatelia WHERE id = ?";
    db.query(sql, [req.params.id], (error, vysledok) => {
        if (error) return res.status(500).send("Chyba SQL");
        if (!vysledok.affectedRows) return res.sendStatus(404);
        res.send("Pouzivatel vymazany");
    });
});

// 4. Overenie prihlasovacich udajov
app.post("/api/prihlasenie", (req, res) => {
    const { email, heslo } = req.body;

    if (!email || !heslo) {
        return res.status(400).json({ sprava: "Zadajte e-mail aj heslo" });
    }

    const sql = "SELECT * FROM pouzivatelia WHERE email = ?";
    db.query(sql, [email.trim()], async (error, vysledok) => {
        if (error) return res.status(500).json({ sprava: "Chyba SQL" });

        // Ak e-mail v databaze neexistuje
        if (vysledok.length === 0) {
            return res.status(401).json({ sprava: "Nespravny e-mail alebo heslo" });
        }

        const pouzivatel = vysledok[0];
        const zhoda = await bcrypt.compare(heslo, pouzivatel.heslo_hash);

        if (!zhoda) {
            return res.status(401).json({ sprava: "Nespravny e-mail alebo heslo" });
        }

        res.json({
            sprava: "Prihlasenie uspesne",
            pouzivatel: {
                id: pouzivatel.id,
                meno: pouzivatel.meno,
                email: pouzivatel.email
            }
        });
    });
});

app.use((req, res) => {
    res.status(404).sendFile(__dirname + "/404.html");
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});