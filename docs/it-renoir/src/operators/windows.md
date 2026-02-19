Quando si lavora con flussi di dati illimitati è spesso necessario considerare solo un sottoinsieme dei dati per eseguire alcuni calcoli. **Renoir** fornisce un insieme di operatori che ti permettono di definire finestre sui flussi di dati per eseguire il calcolo solo sui dati che fanno parte della finestra.
In **Renoir** le finestre sono definite da un descrittore `WinDescr` che permette all'utente di specificare il tipo e la logica utilizzata per raggruppare i dati all'interno della finestra giusta.

## Descrittori di Finestre
Ci sono diversi tipi di descrittori che possono essere utilizzati:
- **CountWindow**: definisce una finestra basata sul numero di elementi nella finestra. Può essere definita come finestre `tumbling` o `sliding`.
- **EventTimeWindow**: definisce una finestra basata sui timestamp degli eventi dei dati. Può essere definita come finestre `tumbling` o `sliding`.
- **ProcessingTimeWindow**: definisce una finestra basata sull'orologio di sistema al momento del processamento. Può essere definita come finestre `tumbling` o `sliding`.
- **SessionWindow**: definisce una finestra che si divide dopo se nessun elemento viene ricevuto per una durata fissa dell'orologio di sistema.
- **TransactionWindow**: definisce una finestra basata su una logica definita dall'utente. Un'analisi completa di questo descrittore può essere trovata nella [Documentazione dell'API TransactionWindow](https://deib-polimi.github.io/renoir/renoir/operator/window/struct.TransactionWindow.html).


## Finestre su un singolo flusso
Se il flusso NON è partizionato in alcun modo come usando gli operatori `group_by` o `key_by`, la finestra è definita sull'intero flusso. 
L'operatore che ti permette di definire una finestra sul flusso è `window_all`. L'operatore `window_all` prende un [descrittore](#descrittori-di-finestre) della finestra come argomento e restituisce un flusso con finestre che può essere utilizzato per eseguire calcoli sulla finestra.

```Rust
let s = env.stream_iter(0..5usize);
let res = s
    .window_all(CountWindow::tumbling(2))
    // resto della pipeline
```

> Nota che poiché la finestra è definita sull'intero flusso, questo operatore non può essere parallelizzato. Se possibile partiziona il flusso usando gli operatori `group_by` o `key_by` per permettere l'esecuzione parallela.

## Finestre su un flusso partizionato
Se il flusso è partizionato in qualche modo come usando gli operatori `group_by` o `key_by`, la finestra è definita su ogni partizione. Possiamo definire le nostre finestre usando l'operatore `window` con il [descrittore](#descrittori-di-finestre) che vogliamo.

```Rust
let s = env.stream_iter(0..9);
let res = s
    .group_by(|&n| n % 2)
    .window(CountWindow::sliding(3, 2))
    // resto della pipeline
```

se vogliamo creare una finestra dopo aver unito due `KeyedStream` sulla stessa chiave possiamo usare l'operatore `window_join`.

```Rust
let s1 = env.stream_iter(0..9);
let s2 = env.stream_iter(0..9);

let res = s1
    .key_by(|&n| n % 2)
    .window_join(s2.key_by(|&n| n % 2), CountWindow::tumbling(2))
    // resto della pipeline
```

## Operatori sulle finestre
Una volta definita la finestra possiamo eseguire diverse operazioni per ottenere le informazioni desiderate. Alcune delle operazioni possibili sono le standard `max`, `min`, `sum` o `count` ma sono disponibili anche operazioni più complesse come l'operatore `fold`.

Per una lista completa degli operatori disponibili controlla la [Documentazione dell'API](https://deib-polimi.github.io/renoir/renoir/struct.WindowedStream.html#).

```Rust
let s = env.stream_iter(0..5usize);
let res = s
    .window_all(CountWindow::tumbling(2))
    .fold(0, |acc, value| acc + value)
    .collect_vec();
```