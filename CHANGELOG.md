# Patch 2.0.1.8

[list]
[*] [Novità]: Adesso potrete mettere in pausa la finestra di output principale in maniera piu' immediata. Posizionate il mouse al di sopra della finestrra e scrollate
il mouse verso l'alto così da attivare auromaticamente la pausa. Viceversa, scrollando verso il basso (all'ultimo rigo della finestra) la pausa si disattiverà. 
Il tasto "metti in pausa" rimane e funziona sia per notifica che per attivare la pausa sul click del medesimo e senza quindi cambiare il comportamento fino ad ora esistito. E' stato rimosso però il "segnalibro pausa" in quanto creava dei "glitch" quando la pausa veniva disattivata.
[*] [Novità]: Adesso le frecce della tastiera "sopra" e "sotto" che richiamano i precedenti comandi funzioneranno anche se non avete selezionata la barra dei comandi. Ovunque avrete il mouse, eccetto che sulla mappa nel caso usiate le frecce per spostare il personaggio, richiamerà le funzioni di cui sopra.
[*] [Migliogira] Adesso potete selezionare e copiare i testi presenti nel client con le combinazioni di tasti classici (Ctrl + C per copiare e Ctrl + V per incollare su Windows, Cmd ⌘ + C per copiare e Cmd ⌘ + V per incollare sui sistemi Macintosh).
[*] [Miglioria]: Adesso se durante i viaggi e gli spostamenti guardarete qualcosa (un contenitore, un mob, un altro giocatore, un oggetto o una direzione), la vista si terrà aperta sul dettaglio senza tornare fastidiosamente sulla vista stanza ad ogni cambio di casella. Per annullare questa condizione vi basterà dare un nuovo comando "guarda". Occhio alle buche! 
[*] Il pannello "personaggio disconesso" ora mostra anche l'immagine del personaggio (se l'avete) e il suo nome.
[*] Il click del mouse sul "guarda" oggetti/mob/personaggi dall'icona associata si azionerà adesso sul "rilascio" del click anziché al primo tocco, così da evitare una troppa tempestività nel comando.
[*] [Fix] In presenza di oggetti multistrato (collana + gorgiera), il comando EQUIP mostrava solo l'oggetto indossato per ultimo facendo sparire quello sottostante. L'errore è stato corretto. Attenzione: l'elemento inferiore rimane comunque nascosto sul comando "guarda" [target] anche quando lo farete su voi stessi in quanto vi fa capire imprescindibilmente cosa gli altri vedrebbero di voi.
[*] [Fix] Corretto un errore per il quale, guardando una stanza adiacente (es guarda est,) veniva sì mostrato correttamente il dettaglio marginale della direzione guardata ma assieme veniva visualizzata per errore la descrizione della stanza in cui ci si trovava. 
[*] [Fix] Dopo aver guardato un contenitore o qualcosa/qualcuno, il widget stanza smetteva di auto aggiornarsi randomicamente. Dovrebbe essere stato (speriamo) corretto.
[*] [Fix] Sistemato un errore al logut che erroneamente manteneva i comandi di gioco nella barra di navigazione anzichè ritornare alla versione di default (pagina login).
[*] [Fix]: La descrizione personaggio nella scheda personaggio (info) mostra adesso la modifica subito dopo che questa è stata modificata. Prima si doveva chiudere e riaprire la scheda o digitare di nuovo il comando "info".
[*] [Fix]: Pannello scorciatoie: Apportati diversi fix al layout dei pannelli sia a quello di modifica e aggiunta , che a quello della lista a icone per l'utilizzo rapido. E' stato corretto inoltre un errore nella lista [b]icone-scorciatoie [/b] per il quale dopo l'ultimo aggiornamento aveva smesso di aprirsi.
[*] [Fix] L'icona "attiva/disattiva" widgets nella barra comandi si mostrava anche quando non era possibile usarli durante l'uso del browser a dimensioni ridotte. L'errore è stato corretto.
[*] [Fix] Il tooltip "Dimensione font" appare ora correttamente sopra il suo pulsante anziché essere sparato sull'estremo margine sinistro del client.
[*] [Fix At Personam] Comando architetti "edi lista". Il giocatore Raziel (si solo lui :-p ) probabilmente non poteva usare il comando "edificio lista" per via di un errore nei dati che il server spediva. Corretto!
[*] Aggiunto link alle ultime novità nel login.
[*] Cambiato l'orientamento dell'icona del widget "equip e inventario" sui due stati "aperto / chiuso".
[*] Rimossa la pagina delle novità e il link nella barra di navigazione. Questa ritornerà all'interno del nuovo sito.
[*] Ottimizzate tutte le finestre (dialog e modal) del gioco e corretti numerosi bug nel codice.
[/list]