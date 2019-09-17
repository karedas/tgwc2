# Generale #
Durante il break estivo, abbiamo avuto modo di iniziare a lavorare a una serie di miglioramenti strutturali e funzionali del WebClient di TG, pronti per una nuova stagione ricca di novita'.
E' nostra intenzione dedicare una buona parte del nostro tempo all'analisi dell'utilizzo del webclient e delle richieste dell'utenza, in modo da spingerlo al piu' immediato utilizzo possibile e per cercare di  ridurre qualsiasi tipo di frizione che potrebbe materializzarsi durante una transizione dal precedente Avenger Client o nel venire in contatto con TheGate MUD per la prima volta.

## Impaginazione, Grafica, Fonts e cambi di stato ##
Facendo un passo indietro ed osservando il client in una nuova ottica, abbiamo lavorato ad alcune migliorie grafiche, revisionando l'impaginazione, formattazione e tipografia dell'intero client, ottenendo, a nostra opinione un maggior livello di leggibilita' sia all'interno dello scroll di gioco che nell'utilizzo dell'intera interfaccia.
Abbiamo inoltre ottimizzato e ridotto all'osso ogni spazio "inutile", innanzitutto rimuovendo tutta una serie di sprechi di spazio e "fastidi" che potevano rendere l'esperienza di gioco un po' acquosa e confusionaria. 

## Login ##
Una nuova pagina di accesso rapido è stata creata per permettere gli utenti di connettersi. 
L'abbiamo ridotta all'essenziale rendendola piu' immediata in quanto sarà successivamente innestata all'interno del futuro nuovo sito del gioco. 
Non volevamo troppi fronzoli in quanto abbiamo preferito modellare il client come una vera e propria APP. Carinerie grafiche, effetti, etc torneranno quindi con l'arrivo del sito vero e proprio.

In alto a destra troverete inoltre un pulsante *REGISTRATI*. Questo porterà alla pagina di **registrazione nuovo personaggio**. Attualmente l'abbiamo lasciata solo per mostrarvi questa condizione in quanto la sua funzionalità rimane disabilitata in attesa di concludere gli ultimi test.


# Client # 
[*] Abbiamo corretto i font sparsi e messi a casaccio su tutto il client per seguire così una  linea "tipografica" ordinata e meno lineare.
La totale interfaccia è stata inoltre setacciata da cima a fondo nell'obiettivo di ripulirla e ottimizzarla da tutti quella serie di elementi grafici e di impaginazione che la rendevano un po' traballante nell'insieme. Ci siamo quindi occupati di correggere gli spazi e i margini inutili tra i contenuti, allineare correttamente testi ed elementi, dare "colore" seguendo una tavola colori ben precisa. Questo e molto altro, ma vi basterà aprirlo per riuscire a scorgere il cambiamento.

## Barra di navigazione principale (nuova) ##
La nuova **barra di navigazione** ha ora una grafica piu' solida e istituzionale, con il logo di TheGate ben evidente a fare da "insegna" sulla sinistra.
La barra presenta inoltre °2 stati°: esteso e compatto (o responsive). Vi basterà ridurre oltre una certa soglia il browser
per vedere apparire un'icona "hamburger" e poter aprire così un menu' verticale usufruibile da qualsiasi tipo di dispositivo o risoluzione.

Il menu' (orizzontale) ha, oltre a ciò che già aveva, anche dei pulsanti a degli widget e funzionalità specifiche quali 
  [*] Gestione della dimensione del testo.
  [*] Widgets (vedi sotto)
  [*] Pannello gestione scorciatoie
  [*] Attiva/Disattiva audio di gioco
  [*] Versione del client (molto importante per avere un riferimento immediato, vi basterà passarci il mouse sopra per leggerne l'esatta release).

Inoltre avrete ben in vista il tempo di gioco giorno/mese/anno (a breve questo riceverà un'ulteriore aggiunta ).

## Output e Scroll di gioco ##
[*] Sistemata e ottimizzata l'formattazione del testo in arrivo.
[*] Nuova tavola di colori e nuovo font (piu' chiaro e leggibile).
[*] [NOVITA'] Lo scroll ora può essere ora messo in PAUSA (pulsante PAUSA - vedi sotto ).
  Quando attiverete la Pausa apparirà un "avviso luminoso" attorno alla finestra dello scroll insieme ad un "badge" sulla parte superiore della finestra così da indicarvi l'entrata in "PAUSA". Inoltre, appena attiverete la pausa, verrà inserito una orta di "segnaposto" nell'esatta posizione del testo in cui avrete deciso di mettere pausa. Questo segnaposto è inoltre raggiungibile in maniera immediata dal **badge** di cui sopra, così da andare immediatamente al punto in cui avete lasciato la vostra lettura in sospeso.
  Una volta tolta la pausa, tutto tornerà come prima.
[*] Alcuni Fix vari: 
  [**] L'ordinamento dell' equipaggiamento è stato corretto (guarda mob/pg/voi stessi)
  [**] Un link a "Guarda dove si trova" è stato aggiunto per permettervi di guardare al volo la "stanza" in cui si trova cosa state guardando.
  [**] E' stata rimossa la versione "doppia colonna" dalla zona DETTAGLI (colonna sulla destra, guardando una stanza con unmerosi oggetti o mob) così da evitare disordini sull'impaginazione
  [**] Aprendo una lista superiore ad una certa soglia (15) appare ora una riga con su scritto "altri [Numero]..."


## WIDGET [Novità] ##
La zona "DETTAGLI", che permetteva di splittare l'output di gioco in una seconda colonna e nella quale filtrare al suo interno tutta una serie di dati (stanza, oggetti e mob guardati etc) è stato ripensata in modo da poter accogliere una nuova formula di gestione.
Adesso questa condizione si attiverà dal pulsante "WIDGET" presente nella barra di navigazione. Qui vedrete la lista di widgets ( 2 per ora) che potrete selezionare e deselezionare per attivare i rispettivi pannelli.
Questi inoltre presenteranno un comodo "split" in altezza  che potrete regolare sulla base delle vostre necessità.

[*] **Dettagli Stanza**.
E' il comportamento già visto: toglierà dallo scroll principale i dati "stanza", "oggetti e mob presenti", "dettagli di chi o cosa guardate" e li inserirà in questa zona così da alleggerire notevolmente lo scroll principale. Se il pannello verrà disattivato riporterà tutto ciò che questo ha raccolto all'interno dello scroll di sinistra.
[*] **Equipaggiamento / Inventario [NOVITA']**. 
La vera novità! Questo widget vi permetterà di avere a disposizione e sempre visibile il vostro equipaggiamento e inventario, distribuito all'interno di due comodi TAB. Alcune caratteristiche che dovreste sapere quando lo utilizzerete:
[*] Se il widget è aperto, digitando "equip" o "inventario" nella inputbar, verrete spostati automatiacmente tra uno o l'altro di questi tab.
[*] Il Widget può essere COLLASSATO temporaneamente casomai aveste ad esemopio il bisogno di vedere per intero il widget DETTAGLI STANZA.
[*] Le liste si auto aggiornano sul cambiamento
[*] In mancanza di spazio (verticale), potrete scorrere al loro interno.
[*] Se il widget è disattivato, scrivere EQUIP O INVENTARIO aprirà di default la finestra della vostra scheda personaggio.

Entrambi gli widget possono essere attivati singolarmente.

## Nuova barra di stato [NOVITA]' ##
E' stato messo a disposizione dei player un metodo rapido per il proprio cambiamento di stato (velocità, assetto di combattimento/difesa, postura) tramite l'inserimento di dropdowns nella barra di stato. La barra è munita anche di un dato sul peso trasportato (in percentuale) che autonomamente acquisirà un colore diverse sulla base delle facoltà di trasporto del vostro perosnaggio (verde/giallo/rosso).

## Dashboard Eroe ##
[*] La resa grafica è stata ottimizzata e ripensata per renderla compatta e meno dispersiva. 
[*] [novità] Potete ora vedere, accanto al nome, il vostro stato di "Nascosto nelle ombre". Ovviamente non indicherà che siete realmente invisibili agli occhi altrui, ma che state tentando di nascondervi (!)
[*] [novità] Quando vi muoverete o sarete in viaggio, apparirà  sulla destra una notifica testuale la quale vi indicherà la direzione di movimento intrapresa. Questo servirà da "indicazione" per poter capire di essere in moto e capire che siete in movimento anche nelle zone di mappa nelle quali non era molto chiaro di esserlo per davvero.
[*] La zona "TARGET", che prima appariva unicamente durante l'avvio del combattimento, adesso è sempre visibile e si popolerà durante lo scontro.

## Barra comandi ##
[*] E' stata dipinta di nero, ci sembra molto piu' chiaro leggere il comando così che perso nel bianco precedente.
[*] [Fix] Adesso sarete *davvero* (:P) riportati sulla barra comandi quando scriverete qualcosa o digiterete invio in qualsiasi parte del client!.
[*] Alcuni pulsanti precedentemente presenti sono stati spostati sul menu' principale (vedi sopra), ad eccezione del "[novità] pausa" e dei già conosciuti "attiva/disattiva dashboard" e "modalità Zen".

## Regione e Territorio ##
Adesso il dato è piu' evidente e mostrerà con un piccolo testo il tipo di allineamento del territorio (pacifico, guerra!, selvaggia etc).


# Altre funzionalità #

## Finestre ##
Tutte le finestre sono state "riqualificate" e ottimizzate seguendo la filosofia di pulizia spiegata sopra. 
Tra queste, spendiamo qualche parola in piu':

### Scheda personaggio ###
Ottimizzata , ripulita e riquantificata nelle dimensioni e negli spazi di lettura. 
[*] La pagina "abilità" ora ha un nuovo comportamento di apertura/chiusura al suo interno. Sono stati anche sistemati i dati che mostravamo  per ogni abilità ( ... :P ).
[*] Le liste equipaggiamento e inventario adesso sono cliccabili (guarda oggetto)!

### Liste di lavoro e generiche ###
[*] [FIX] Ordinamento delle colonne (sorting) sistemato e scorrere tra le pagine non disallineerà i dati. Ogni "click" sull'azione adesso è sempre associato correttamente alla riga dell'elemento voluto.

### LOG ###
Nuova grafica e formattazione per la pagina di log.
[*] [fix] Corretto bug sulla DATA di inizio log. 
[*] [fix] Adesso registrerà le vostre partite correttamente dal momento che loggherete con il vostro personaggio
[*] [Novità] Tramite l'opzione "salva log alla chiusura" (attiva di default e modificabile nel pannello PREFERENZE) adesso ogni qual volta sloggherete intenzionalmente e non dal gioco, vi verrà chiesto di salvare il log. Così non perderete piu' le vostre giocate!


### Varie ed eventuali ###
[*] comando "aggettivo lista" non mostrava niente per chi aveva bisogno di cambiare l'aggettivo. Adesso si potrà visualizzare la finestra con gli aggettivi possibili, selezionare quello desiderato e attivarlo.
[*] Tutte le liste equip e inventario sono adesso cliccabili.
[*] Ora se l'utente disattiva l'audio questo non verrà scaricato in background comunque.
[*] Sistemato un errore su un'icona mancante nell'USURA. Se eri devastato non mostrava nulla.
