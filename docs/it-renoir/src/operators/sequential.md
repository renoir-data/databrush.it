**Renoir** offre una moltitudine di operatori per trasformare e manipolare stream di dati. In questa sezione, vedremo come utilizzare gli operatori di base per eseguire trasformazioni sequenziali su uno stream.

Una trasformazione sequenziale è un'operazione che viene applicata a ogni elemento dello stream una volta in sequenza. Questo ci permette di ottenere il massimo livello di parallelismo e di distribuire il carico equamente tra le risorse disponibili.

## Map
L'operatore `map` è usato per applicare una funzione a ogni elemento dello stream. La funzione può essere qualsiasi closure che prende un elemento dello stream come input e ritorna un nuovo elemento.

```rust
// Moltiplica ogni elemento dello stream per 10
let res = s.map(|n| n * 10).collect_vec();
```
L'operatore map, dato che è applicato a ogni elemento indipendentemente, può usare tutto il potere del parallelismo.

## RichMap
L'operatore `rich_map` è simile all'operatore `map` ma permette di mantenere uno stato tra gli elementi dello stream. La funzione passata all'operatore `rich_map` può essere stateful e mantenere uno stato per ogni replica.

```rust
// Enumera gli elementi dello stream
let res = s.rich_map({
    let mut id = 0;
    move |x| {
        id += 1;
 (id - 1, x)
 }
}).collect_vec();
```
> Nota che lo stato è mantenuto per ogni replica dell'operatore, quindi in questo caso, se manteniamo il parallelismo ci saranno elementi multipli con lo stesso ID (uno per ogni replica).

## Filter
L'operatore `filter` è usato per mantenere solo gli elementi dello stream che soddisfano una certa condizione. La funzione passata all'operatore `filter` deve ritornare un valore booleano.

```rust
// Mantieni solo gli elementi pari dello stream
let res = s.filter(|&n| n % 2 == 0).collect_vec();
```
L'operatore filter, dato che è applicato a ogni elemento indipendentemente, può usare tutto il potere del parallelismo.

## Flatten
L'operatore `flatten` è usato per appiattire uno stream di collezioni di elementi. Prende uno stream di container e ritorna uno stream con tutti gli elementi contenuti.

```rust
let s = env.stream_iter((vec![
    vec![1, 2, 3],
    vec![],
    vec![4, 5],
].into_iter()));
let res = s.flatten().collect_vec();
env.execute_blocking();

assert_eq!(res.get().unwrap(), vec![1, 2, 3, 4, 5]);
```

## Concatenazione di Operatori Sequenziali
Per aiutare l'utente a scrivere codice pulito e leggibile, **Renoir** offre una serie di concatenazioni degli operatori precedenti in una singola chiamata. Questo permette di scrivere trasformazioni complesse in una singola riga di codice.
Da concatenazioni semplici come `flat_map` dove il risultato di una map viene appiattito, a quelle più complesse come `rich_filter_map` dove l'utente può eseguire una map e filter stateful in una singola operazione.

Per una lista completa degli operatori vedi la [documentazione API](https://docs.rs/renoir/latest/renoir/struct.Stream.html).