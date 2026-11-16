const express = require('express');
const mysql = require("mysql2");
const app = express();

app.use(express.json());
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
    db.query("SELECT id, nazov, autor, rok, cena FROM knihy ORDER BY id", (error, result) => {
        if (error) {
            console.error("Chyba pri načítaní kníh:", error);
            return res.status(500).send("Knihy sa nepodarilo načítať.");
        }
        res.json(result);
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

app.use((req, res) => {
    res.status(404).sendFile(__dirname + "/404.html");
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});