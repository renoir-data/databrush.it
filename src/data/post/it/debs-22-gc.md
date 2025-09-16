---
publishDate: 2022-06-01T00:00:00Z
author: Databrush
title: "Analisi dei dati di mercato con Noir: DEBS grand challenge (DEBS 22)"
excerpt: Oggi, l'analisi dei dati guida il processo decisionale in praticamente ogni attività umana. Questo richiede piattaforme software che offrano astrazioni di programmazione semplici per esprimere task di analisi dei dati e che possano eseguirli in modo efficiente e scalabile...
# image:
category: Ricerca
tags:
  - Ricerca
  - DEBS
# metadata:
---

Siamo felici di annunciare che abbiamo vinto il **DEBS 2022 Grand Challenge** con la nostra piattaforma: **Renoir**.

La **Distributed and Event-Based Systems (DEBS) Grand Challenge** è una competizione prestigiosa che valuta le prestazioni dei sistemi distribuiti nell'elaborazione di flussi di dati su larga scala. La nostra proposta mostra le capacità di **Renoir**, una piattaforma di elaborazione dati che combina astrazioni di programmazione di alto livello con un'esecuzione efficiente.

**Clicca [qui](https://dl.acm.org/doi/10.1145/3524860.3539646) per leggere l'articolo completo!**

## La DEBS 2022 Grand Challenge

La DEBS Grand Challenge 2022 coinvolge l'**analisi di dati di mercato reali di Infront Financial Technology**, composta da oltre 50 milioni di eventi di trading su tre principali borse.

Ai partecipanti è richiesto di implementare una strategia di trading che identifichi tendenze temporali dei prezzi di singole azioni all'interno di finestre temporali non sovrapposte e che attivi consigli di acquisto/vendita quando vengono rilevati pattern specifici.

La sfida evidenzia la tensione tra i framework di elaborazione dati general-purpose, che offrono facilità d'uso, e i guadagni prestazionali ottenibili attraverso implementazioni personalizzate e low-level. I partecipanti sono incoraggiati a creare soluzioni riutilizzabili ed estensibili a questo problema data-intensive.

## Renoir: Una Piattaforma di Elaborazione Dati ad Alte Prestazioni

**Renoir**, la nostra piattaforma di elaborazione dati, è nata dalla necessità di gestire dati in streaming con **efficienza e semplicità senza pari**. Costruita su principi simili a quelli dei principali framework di elaborazione dati come Apache Flink e Spark, Renoir aggiunge il suo tocco unico di **astrazione di alto livello senza compromettere le prestazioni**.

La piattaforma è progettata per **astrarre le complessità di deployment, concorrenza e sincronizzazione**, permettendo agli sviluppatori di concentrarsi sulla costruzione della logica. Renoir utilizza una struttura di pipeline semplificata che elabora i dati come grafi aciclici diretti, scomponendo ogni passo in fasi gestibili. Questo modello è cruciale per task che coinvolgono flussi di dati continui dove decisioni in frazioni di secondo possono fare una **differenza significativa**.

Utilizza **canali di comunicazione ottimizzati** per passare i dati tra i nodi di elaborazione in modo efficiente, **minimizzando colli di bottiglia e latenza**. Questa caratteristica è fondamentale per applicazioni come l'analisi di dati finanziari, dove la capacità di reagire rapidamente a nuove informazioni è fondamentale.

## La Nostra Soluzione

L'architettura della soluzione ha caratterizzato i seguenti componenti:

- **Modulo di Comunicazione gRPC**: Per interagire con la piattaforma di valutazione della sfida, abbiamo implementato un modulo gRPC personalizzato che gestiva sia i dati in ingresso che i risultati in uscita. Questo modulo stabiliva **connessioni parallele** per ottimizzare il flusso dei dati.

- **Gestione del Flusso di Eventi**: Abbiamo creato una pipeline dati iniziando con un operatore `flat_map` che **scomponeva i batch in singoli eventi di trading e sottoscrizioni**. Gli eventi erano partizionati per simbolo utilizzando un operatore `group_by`, abilitando **elaborazione parallela attraverso diversi strumenti**.

- **Calcolo EMA e Gestione dello Stato**: Un operatore personalizzato `rich_filter_map` manteneva lo stato per ogni strumento finanziario. Questo operatore **calcolava gli EMA** utilizzando dati di prezzo recenti, aggiornando lo stato interno man mano che nuovi eventi venivano elaborati. Quando veniva rilevata una richiesta di sottoscrizione, lo stato corrente, inclusi gli EMA più recenti e i segnali di trading, veniva emesso downstream.

- **Raccolta dei Risultati e Invio**: Il passo finale nella pipeline dati coinvolgeva la raccolta dei risultati elaborati e **l'invio di ritorno alla piattaforma di valutazione attraverso il modulo gRPC**. Questo invio era sincronizzato per assicurare che tutti i risultati per un batch fossero completati prima della trasmissione.

Come richiesta bonus abbiamo implementato uno **strumento di visualizzazione intelligente** per comprendere meglio i dati e i risultati della nostra analisi. Questo è stato fatto inviando i dati dall'operatore `rich_filter_map` a un **database Redis** e poi utilizzando un'interfaccia web per visualizzare i dati.

## Valutazione

Testare la nostra soluzione ha coinvolto il deployment su l'infrastruttura fornita dalla DEBS Grand Challenge, che includeva macchine con CPU Intel Haswell e un numero specifico di core. Abbiamo misurato due principali metriche di prestazione: **tempo di esecuzione totale e latenza per batch**.

- **Tempo di Esecuzione Totale**: Questa metrica rappresentava il tempo dalla sottomissione della **prima richiesta gRPC alla consegna dell'ultimo risultato**. Il dataset era diviso in 5.940 batch, ognuno contenente 10.000 eventi, sommando a circa 59,4 milioni di eventi. La prestazione è stata valutata calcolando il throughput come il numero totale di eventi elaborati per unità di tempo.

- **Latenza per Batch**: Abbiamo registrato la differenza di tempo tra la ricezione di un batch e l'invio dei risultati elaborati. Questa misura, presentata come 10°, mediana e 90° percentile, ci ha aiutato a capire come Renoir gestiva i dati in tempo reale sotto carico. I nostri esperimenti hanno rivelato che con una configurazione parallela e connessioni gRPC ottimizzate, **abbiamo raggiunto velocità di elaborazione fino a 2,5 Gbit/s, raggiungendo la capacità della rete**.

Oltre a questa valutazione standard, abbiamo sperimentato con il scaling della soluzione su piattaforme cloud come Amazon EC2 e potenti hardware locali per testare i suoi limiti. I risultati hanno dimostrato che Renoir poteva gestire efficientemente carichi computazionali aggiuntivi senza degradazione significativa delle prestazioni, elaborando oltre 10 milioni di eventi per secondo.

## Conclusione

La DEBS Grand Challenge 2022 è stata un eccellente banco di prova per dimostrare i punti di forza di Renoir. La nostra soluzione ha mostrato **la capacità di Renoir di gestire task complessi di elaborazione dati in tempo reale con focus su scalabilità e bassa latenza**. Abbiamo integrato con successo tecniche di programmazione moderne con potenti astrazioni di stream processing, dimostrando che **le interfacce di programmazione di alto livello non devono venire a scapito delle prestazioni**.

In conclusione, le prestazioni di Renoir in questa sfida hanno consolidato il suo potenziale come piattaforma versatile di elaborazione dati capace di supportare applicazioni esigenti in **finanza, IoT e oltre**.