require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const statusRoutes = require('./routes/statusRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.connect(process.env.DATABASE_CONN, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(statusRoutes);
app.use(authRoutes);


// TODO
// JWT: nur ein Standardtoken, aber kein Refreshtoken? > Dadurch nicht so sicher?
// im Tutorial nachschauen, ob The Net Ninja wirklich nur einen einfachen Token verwendet
// und nicht auf einen Refreshtoken setzt, so wie es Web Dev Simplified tut!

// Status.js Model erstellen > Status wird dann anhand der Email-ID und Uhrzeiten + Wert der Fall-ID
// und Status-Wert in die Datenbank gespeichert. Dann ist eine Suche über Email möglich, über Uhrzeit
// über Status und theoretisch über Status-Wert.

// Variables Formular erstellen: Bei Status 8 zusätzlich das Feld "Zwischenfälle", außerdem das Uhrzeiten-Feld, 
// das automatisch die aktuelle Zeit setzt, aber veränderbar ist.

// Genial wäre auch, dass der aktuell übermittelte Status angezeigt wird (in Datenbank übertragen ebenfalls beim 
// Übersenden der Email, dann updaten und wenn Status 8 gesetzt wird, automatisch Status löschen nach 10 Sekunden
// zum Beispiel. 

// Statusübersichtsseite für Leitstellendisponenten - Filterung nach Zeitstempel

// Statusübermittlung: Min-Length + Fehlerausgabe, wenn Status nicht DRK-2021-12345 14 Zeichen lang ist