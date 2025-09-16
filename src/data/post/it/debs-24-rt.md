---
publishDate: 2024-06-01T00:00:00Z
author: Databrush
title: "Stato Condiviso Sicuro nei Sistemi Dataflow (DEBS 24)"
excerpt: Scopri come il sistema dataflow Renoir introduce lo stato condiviso sicuro, migliorando prestazioni ed efficienza nell'elaborazione dati distribuita. Impara sul suo uso innovativo del modello di ownership di Rust per abilitare codice ad alte prestazioni e scalabile con rischi minimizzati.
# image:
category: Ricerca
tags:
  - Ricerca
  - DEBS
# metadata:

---

Siamo felici di annunciare che il nostro articolo **"Safe Shared State in Dataflow Systems"** è stato accettato alla **18a Conferenza Internazionale ACM sui Sistemi Distribuiti e Basati su Eventi (DEBS 2024)**.

**Clicca [qui](https://dl.acm.org/doi/10.1145/3629104.3666029) per leggere l'articolo completo!**

## Perché lo stato condiviso è importante

Nell'elaborazione dati distribuita, il modello dataflow è diventato una scelta popolare per gestire task di analisi su larga scala. Tuttavia, i sistemi dataflow tradizionali tipicamente evitano qualsiasi stato condiviso tra le operazioni per semplificare l'esecuzione e prevenire potenziali conflitti. Mentre questa scelta di design permette **ai task di funzionare indipendentemente, può anche limitare l'efficienza,** specialmente mentre la potenza computazionale delle singole macchine aumenta. Questo ha ispirato la creazione di un **modello esteso che offre un modo per condividere lo stato in sicurezza all'interno di un ambiente dataflow**.

Nei sistemi dataflow, i calcoli sono tradizionalmente strutturati come sequenze di operatori che elaborano dati in isolamento. Ogni operatore elabora il suo input e passa i risultati agli operatori downstream, spesso senza mantenere alcuno stato intermedio. Mentre questo approccio promuove l'affidabilità, significa anche che gli operatori non possono condividere risorse comuni, il che porta a vincoli prestazionali.

Ad esempio, un sistema che elabora dati in streaming può accedere ripetutamente agli stessi dati o servizi esterni, portando a uso ridondante delle risorse. **Senza stato condiviso, gli operatori possono creare copie o connessioni non necessarie, consumando memoria e larghezza di banda**.

## Introduzione al Modello di Condivisione Stato Sicuro di Renoir

Il sistema dataflow **Renoir** affronta questa sfida estendendo il modello dataflow per permettere la condivisione dello stato entro limiti definiti. Renoir usa il modello di ownership di Rust, che abilita la condivisione sicura delle risorse senza garbage collection runtime. **Questo modello assicura che gli sviluppatori possano scrivere codice ad alte prestazioni e scalabile che minimizza i rischi associati all'accesso concorrente alla memoria**.

Benefici Chiave e Casi d'Uso:

- **Dati Condivisi Solo in Lettura**:

con Renoir, gli operatori possono condividere **dati solo in lettura attraverso più task** all'interno di un singolo worker. Ad esempio, task di elaborazione grafi possono accedere a una struttura grafo condivisa piuttosto che caricare copie individuali, portando a una migliore utilizzazione della memoria e minor overhead.

- **Strutture Dati Concorrenti**:
**Renoir** supporta la condivisione di strutture dati concorrenti, come hashset, che **permettono ai task di lavorare in parallelo accedendo in sicurezza a risorse condivise**. Renoir assicura che le strutture dati possano essere condivise tra task in modalità lettura-scrittura solo se garantiscono accesso concorrente sicuro permettendo l'uso di strutture dati aggiornabili senza rischiare corruzione dei dati.

- **Accesso coordinato a sistemi esterni**:
molte applicazioni data-driven accedono frequentemente a database esterni, ad esempio nell'arricchimento eventi, che coinvolge l'integrazione delle informazioni trasportate dagli eventi in un flusso con informazioni statiche accessibili da un database esterno. In **Renoir**, i task possono condividere un pool di connessioni, **riducendo la necessità di connessioni ridondanti e migliorando i tempi di risposta**.

- **Operazioni Asincrone**:
il modello di stato condiviso supporta anche l'esecuzione asincrona, ideale per applicazioni che necessitano interazioni di rete. Condividendo un runtime asincrono tra i task, **Renoir può minimizzare i cambi di contesto, migliorando il throughput complessivo**.

- **Pattern di Comunicazione Avanzati**:
Il **paradigma dataflow tradizionale** consuma dati da dataset statici o in streaming, **applica una sequenza di trasformazioni e alimenta i risultati a sink esterni.** Tuttavia, i sistemi esterni possono adottare **pattern di interazione diversi.**
**Renoir abilita la gestione della comunicazione request-response all'interno del programma driver,** che può poi interagire con i task attraverso primitive di memoria condivisa sicure, **senza l'overhead di sistemi esterni** come Apache Kafka.

- **Cache Condivisa**: quando si accede a dati da risorse esterne come un database o un servizio remoto, alcune applicazioni possono tollerare dati leggermente obsoleti. In questi scenari, memorizzare una cache locale in memoria con dati recentemente osservati può ridurre le interazioni con risorse esterne e migliorare le prestazioni. **Nel nostro modello esteso, una singola cache può essere condivisa tra i task che funzionano nello stesso worker.** Questo permette di ridurre il consumo di memoria.

## Risultati delle Prestazioni

Il modello Renoir dimostra miglioramenti significativi delle prestazioni in vari scenari seguendo i casi d'uso menzionati [sopra](#introduzione-al-modello-di-condivisione-stato-sicuro-di-renoir).

- **Dati Condivisi Solo in Lettura**: testando il nostro modello su due task di elaborazione grafi, **PageRank e Componenti Connesse**, abbiamo osservato un **miglioramento delle prestazioni fino a 3 volte** rispetto alle implementazioni dataflow tradizionali.

- **Strutture Dati Concorrenti**: abbiamo implementato un test che coinvolge il rilevamento e lo scarto di elementi duplicati da un dataset di input. Con la nostra implementazione, **Renoir** ha ottenuto prestazioni migliori **riducendo l'uso della memoria e i dati trasferiti alla rete**.

- **Accesso coordinato a sistemi esterni**: in un benchmark che confronta Renoir con sistemi dataflow tradizionali, nell'uso di servizi esterni per l'arricchimento dati, **Renoir è fino a 50 volte più veloce** condividendo connessioni tra i task.

- **Operazioni Asincrone**: per valutare i benefici del nostro modello esteso abbiamo utilizzato la stessa applicazione di arricchimento eventi discussa prima, ma interagiamo con il database usando API asincrone. **Renoir** ha ottenuto un **miglioramento delle prestazioni fino a 2 volte** rispetto ai sistemi dataflow tradizionali.

- **Pattern di Comunicazione Avanzati**: Per esemplificare l'uso del nostro modello di memoria condivisa per implementare pattern di comunicazione personalizzati, abbiamo implementato l'ultima edizione della [DEBS Grand Challenge]({{< ref "/blog/debs-22-gc.md" >}}).

- **Cache Condivisa**: Valutiamo questo scenario usando un'altra variante del caso d'uso di arricchimento che memorizza i risultati delle interazioni database. La nostra implementazione si basa su quella presentata nella sezione precedente, e usa API asincrone per interagire con il database. Introduce una cache di valori recentemente letti che è condivisa tra i task all'interno di un worker. **Renoir** ha ottenuto un **miglioramento delle prestazioni fino a 10 volte** rispetto ai sistemi dataflow tradizionali.

## Andare Avanti con lo Stato Condiviso Sicuro nel Dataflow

Mentre le richieste di elaborazione dati continuano a crescere, **Renoir** fornisce un percorso in avanti sfruttando la potenza dello stato condiviso con rigorose garanzie di sicurezza. **Per sviluppatori e aziende, questo significa il potenziale per sistemi più efficienti e scalabili che utilizzano meglio le risorse hardware**.