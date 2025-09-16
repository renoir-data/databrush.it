---
title: Operatori Iterativi
order: 5
---

Potrebbe esserci la possibilità che tu abbia bisogno di iterare su un flusso più volte per ottenere le intuizioni corrette o per eseguire un calcolo complesso. **Renoir** fornisce un insieme di operatori esattamente per questo scopo.

## Iterate
Questo operatore permette di creare un flusso di lavoro iterativo dove i dati ciclano attraverso lo stesso insieme di operatori più volte. Questo operatore ha diverse caratteristiche:
- **Iterazioni Massime**: Il numero massimo di iterazioni da eseguire. Se viene raggiunto il numero massimo di iterazioni, l'operatore interromperà l'iterazione e produrrà lo stato corrente dei dati.
- **Stato dell'Iterazione**: Lo stato che tutte le repliche di questo operatore possono leggere. Lo stato può essere aggiornato alla fine di ogni iterazione dalla funzione `global_fold`.
- **Body**: L'insieme di operatori che verrà eseguito ad ogni iterazione. L'output del body verrà utilizzato come input dell'iterazione successiva.
- **Local Fold**: La funzione che verrà eseguita da ogni replica utilizzata per aggiornare lo Stato dell'Iterazione, i risultati verranno aggregati dalla funzione `global_fold`.
- **Global Fold**: La funzione che verrà eseguita per aggregare i risultati della funzione `local_fold` e aggiornare lo Stato dell'Iterazione.
- **Condizione del Loop**: La condizione che verrà valutata alla fine di ogni iterazione per decidere se l'iterazione deve continuare o meno.

```Rust
let s = env.stream_iter(0..3).shuffle();
let (state, items) = s.iterate(
    3, // al massimo 3 iterazioni
    0, // lo stato iniziale è zero
    |s, state| s.map(|n| n + 10),
    |delta: &mut i32, n| *delta += n,
    |state, delta| *state += delta,
    |_state| true,
);
let state = state.collect_vec();
let items = items.collect_vec();
```
> se vuoi riciclare lo stesso input iniziale e non il risultato dell'iterazione precedente, puoi usare l'operatore `replay`. Il `replay` è molto simile all'operatore `iterate` cioè richiede gli stessi parametri, ma riprodurrà il flusso di input ad ogni iterazione.