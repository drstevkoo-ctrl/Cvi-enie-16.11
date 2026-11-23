-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hostiteľ: 127.0.0.1
-- Čas generovania: Po 23.Nov 2026, 11:24
-- Verzia serveru: 10.11.16-MariaDB
-- Verzia PHP: 8.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáza: `knihy`
--

-- --------------------------------------------------------

--
-- Štruktúra tabuľky pre tabuľku `knihy`
--

CREATE TABLE `knihy` (
  `id` int(11) NOT NULL,
  `nazov` varchar(150) DEFAULT NULL,
  `autor` varchar(120) DEFAULT NULL,
  `rok` int(11) DEFAULT NULL,
  `cena` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Sťahujem dáta pre tabuľku `knihy`
--

INSERT INTO `knihy` (`id`, `nazov`, `autor`, `rok`, `cena`) VALUES
(1, 'Pan prstenov', 'J. R. R. Tolkien', 1954, 0.00),
(2, 'Lakomec', 'Molière', 1668, 10.00),
(3, 'Zločin a trest', 'F. M. Dostojevskij', 1866, 5.00),
(4, '1984', 'George Orwell', 1949, 0.00),
(5, 'Malý princ', 'Antoine de Saint-Exupéry', 1943, 0.00),
(6, 'Na západe nič nové', 'Erich Maria Remarque', 1929, 0.00),
(7, 'Matka', 'Jozef Gregor Tajovský', 1921, 0.00),
(8, 'Hamlet', 'William Shakespeare', 1603, 0.00),
(9, 'Kto chytá v žite', 'J. D. Salinger', 1951, 0.00),
(10, 'Hobbit', 'J. R. R. Tolkien', 1937, 0.00),
(13, 'Konstruovanie 1', 'Miroslav Bosansky', 2008, 0.00);

-- --------------------------------------------------------

--
-- Štruktúra tabuľky pre tabuľku `pouzivatelia`
--

CREATE TABLE `pouzivatelia` (
  `id` int(11) NOT NULL,
  `meno` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `heslo_hash` varchar(255) NOT NULL,
  `vytvoreny` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Sťahujem dáta pre tabuľku `pouzivatelia`
--

INSERT INTO `pouzivatelia` (`id`, `meno`, `email`, `heslo_hash`, `vytvoreny`) VALUES
(1, 'TimoAdminTheGoat', 'dr.stevkoo@gmail.com', '$2b$10$9bAuI1MEzawcNtxoDi9oPOB4vU9OBg1eV0mFyzFpIq5rbefLn.UuS', '2026-11-23 10:14:17'),
(2, 'jano', 'jankoaaadsadmrkvicka@gmail.com', '$2b$10$NnWy1LNXBfNL9SCu1XkUN.w0vbr4Bsmo6BIPIzrJuuU7cZyvXDFma', '2026-11-23 10:15:11');

--
-- Kľúče pre exportované tabuľky
--

--
-- Indexy pre tabuľku `knihy`
--
ALTER TABLE `knihy`
  ADD PRIMARY KEY (`id`);

--
-- Indexy pre tabuľku `pouzivatelia`
--
ALTER TABLE `pouzivatelia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pre exportované tabuľky
--

--
-- AUTO_INCREMENT pre tabuľku `knihy`
--
ALTER TABLE `knihy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pre tabuľku `pouzivatelia`
--
ALTER TABLE `pouzivatelia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
