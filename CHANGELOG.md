# Patch 2.0.1.4 #
[*] Corretta un problema di visualizzazione nella lista "scorciatoie". Il  tasto "aggiungi" , in presenza di liste molto lunghe, si sovrapponeva a liste molto lunghe..
[*] Ripristinato il colore del testo di libri e pergamene.
[*] Sistemato un errore presente all'interno di alcune finestre (cambia descrizione, nell'attivare un filtro nelle liste lavoro, e tutto ciò che richiedeva un inserimento testuale), per le quali usando il tasto "INVIA" dalla tastiera si veniva riportati alla barra di comandi rendendo impossibile poter inserire degli "a capo" nei testi.
[*] Sistemato bug "guarda immotivato" . Il client, in modalità 2 colonne (solo basse risoluzioni) e ogni qual volta vi era un aggiornamento "STANZA", mostrava sistematicamente la medesima stanza e la lista di mob e oggetti al suo interno come se si fosse lanciato un "guarda".
[*] [Status bar] L'icona "difesa" spariva troppo presto quando si scendeva a basse risoluzioni.
[*] La resa grafica del numero "quantità mob/oggetto stesso tipo" è stata lievemente alleggerita.
[*] [Ordinamento Liste Output] - Adesso le liste MOB/PERSONE/OGGETTI in stanza vengono ordinate dando priorità agli oggetti e mob con quantità in modo da avere una maggiore pulizia nella lettura e ridurre gli "slalom" tipografici. Esempio:

> Lista (Prima) ##:
Uno zaino è stato abbandonato qui
Una sedia di legno [x5]
Un narghilè è qui.
Una pozza di sangue [x20]
------------------
Un bardo sta intonando una canzone di guerra e battaglie.
Una guardia cittadina sta pattugliando le strade. [X40].
Karedas l'eliantiriano è qui.
Una pantegana gigante è qui [x5]

> Lista (Adesso) :
Una pozza di sangue [x20]
Una sedia di legno [x5]
Uno zaino è stato abbandonato qui
Un narghilè è qui.
------------------
Una guardia cittadina sta pattugliando le strade. [X40].
Una pantegana gigante è qui [x5]
Un bardo sta intonando una canzone di guerra e battaglie.
Karedas l'eliantiriano è qui.


