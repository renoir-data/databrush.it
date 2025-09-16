
---
title: Dagli Iterator agli Stream
order: 0
---
>Questa è una guida rapida pensata per persone con una certa familiarità con il linguaggio di programmazione Rust. È pensata come un salto per iniziare a scrivere programmi Renoir velocemente, ma non è completa, quindi fai riferimento al resto della documentazione per maggiori dettagli.

L'introduzione più veloce a Renoir è iniziare pensandolo come iteratori intelligenti (potresti aver visto un approccio simile con [Rayon](https://docs.rs/rayon/latest))

Con `Iterator` hai una sequenza di operatori e applichi trasformazioni come `map()` o `filter()` per trasformare la sequenza e alla fine raccoglierai il risultato in una collezione o eseguirai qualche tipo di operazione che consuma l'iteratore, come `sum()`.

Gli `Stream` di Renoir funzionano allo stesso modo, puoi pensare agli stream in modo simile agli iteratori, ti permettono di iniziare da una `Source` che genera una sequenza di elementi, trasformarli usando `Operator` e raccoglierli o consumare lo stream usando un `Sink`.

La differenza chiave è che gli stream di Renoir sono ottimizzati per computazioni parallele e distribuite e possono essere eseguiti senza soluzione di continuità su una o più macchine connesse.

## Contesto

A causa della natura distribuita di Renoir, dobbiamo fare un paio di cose prima di iniziare. (Iniziamo con un esempio con deployment locale e mostriamo come passare facilmente a un deployment distribuito dopo)

```rust
// Importiamo i componenti core di renoir
use renoir::prelude::*;

fn main() {
 let ctx = StreamContext::new_local();
 // ... Stream e operatori
 ctx.execute_blocking();
 // ...
}
```

Ogni `Stream` di Renoir vive all'interno di un `StreamContext`. Il contesto può contenere più stream e operatori ed è l'oggetto che governa l'esecuzione di tutti gli stream al suo interno.

1. Un `StreamContext` viene creato
2. Uno o più `Stream` sono definiti all'interno del contesto
3. Il `StreamContext` viene eseguito risultando nell'esecuzione di tutti gli stream al suo interno

> Per default Renoir fornisce un metodo `execute_blocking()` che avvia tutti gli stream e operatori e aspetta finché tutti hanno finito. È possibile eseguire l'esecuzione in background eseguendo il metodo `StreamContext::execute_blocking()` in un altro thread
>
> ```rust
> std::thread::spawn(move || ctx.execute_blocking());
> ```
>
> Oppure è anche possibile usare il metodo asincrono `StreamContext::execute()` se la feature `tokio` è abilitata. Nota: per ragioni di performance, solo alcune parti del sistema sono eseguite sullo scheduler asincrono quando la feature è abilitata, mentre la maggior parte degli operatori funziona su thread separati.

## Dagli Iterator agli Stream

Ora vedremo quanto è facile passare da un iteratore a uno stream.

Vogliamo creare uno stream che prende un range di numeri da 0 a 200, filtra i numeri che sono divisibili per 3 o 5, li moltiplica per 2 e raccoglie il risultato in un vettore.

```rust
// Con iteratori
fn main() {
 let input = 0..200;
 let output = input
  .filter(|x| x % 3 == 0 || x % 5 == 0)
  .map(|x| x * 2)
  .collect::<Vec<_>>();
 println!("{output:?}");
}
```

Con **Renoir**, dobbiamo solo creare un contesto, creare uno stream dall'iteratore e applicare gli stessi operatori.

```rust
// Con renoir
use renoir::prelude::*;
fn main() {
 let ctx = StreamContext::new_local();
 let input = 0..200;

 // Stiamo facendo streaming dell'iteratore dalla nostra macchina
 let output = ctx.stream_iter(input)
  .filter(|x| x % 3 == 0 || x % 5 == 0)
  .map(|x| x * 2)
  .collect_vec();
  // Raccogliamo l'output di ritorno alla nostra macchina
 ctx.execute_blocking();

 // Dato che questi stessi stream potrebbero essere eseguiti in un deployment distribuito,
 // dobbiamo assicurarci che questo nodo sia quello che ha raccolto l'output.
 if let Some(output) = output.get() {
  println!("{output:?}");
 }
}
```

Con **Renoir**, possiamo facilmente passare da un iteratore single-thread a uno stream parallelo e distribuito semplicemente cambiando poche righe e riducendo il tempo di esecuzione a una frazione dell'originale.

### Distribuire i dati

Nell'esempio precedente, abbiamo usato un deployment su singolo nodo (`StreamContext::new_local()`) e abbiamo usato `IteratorSource`, che prende come input un iteratore dal **primo nodo** nel deployment e alimenta i suoi elementi in uno stream.

E se volessimo eseguire questo in parallelo?

Abbiamo multiple opzioni:

+ Partizionare e distribuire i dati dopo la source casualmente
+ Partizionare e distribuire i dati dopo la source secondo una logica di raggruppamento
+ Usare una source parallela

#### Mescolamento degli elementi

```rust
let output = ctx.stream_iter(input)
 .shuffle()
 .filter(|x| x % 3 == 0 || x % 5 == 0)
 .map(|x| x * 2)
 .collect_vec();
```

Aggiungendo un operatore `shuffle` dopo la nostra source, gli elementi saranno distribuiti uniformemente tra tutte le repliche disponibili per l'operatore successivo. (Dato che siamo ancora in un deployment locale, per default gli operatori che non hanno limiti sulla replicazione saranno replicati un numero di volte uguale ai core disponibili nel sistema)

#### Raggruppamento degli elementi

Uno degli operatori più versatili nel toolkit di Renoir è l'operatore `group_by` e i suoi derivati. Questo operatore ti permette di definire una *Chiave* per ogni elemento, elementi con la stessa Chiave appartengono allo stesso gruppo.
Quando gli elementi sono raggruppati, i gruppi sono divisi tra le repliche secondo l'`Hash` della Chiave.

Dopo aver applicato un operatore di raggruppamento, lo `Stream` diventerà un `KeyedStream` che permette di interagire con lo stream usando le informazioni di raggruppamento

```rust
let output = ctx.stream_iter(input)
 .group_by(|x| x / 10)
 .filter(|(_key, x)| x % 3 == 0 || x % 5 == 0)
 .map(|(_key, x)| x * 2)
 .collect_vec();
// Nota: l'output di questo esempio è diverso dal precedente
```

#### Source Parallela

Un altro modo per distribuire i dati è usare una source parallela. Usando questa source Renoir creerà un numero di repliche della source e le eseguirà in parallelo.

Nell'esempio seguente, distribuiamo il range di numeri tra i diversi core rendendo l'intero calcolo parallelo.

```rust
let n = 200;
ctx.stream_par_iter(
     move |id, instances| {
         let chunk_size = (n + instances - 1) / instances;
        let remaining = n - n.min(chunk_size * id);
        let range = remaining.min(chunk_size);

        let start = id * chunk_size;
        let stop = id * chunk_size + range;
        start..stop
    })
    .group_by(|x| x / 10)
 .filter(|(_key, x)| x % 3 == 0 || x % 5 == 0)
 .map(|(_key, x)| x * 2)
 .collect_vec();
```

````