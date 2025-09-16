---
title: Operatori Multi-Stream
order: 4
---

Ci saranno momenti in cui abbiamo bisogno di unire più flussi insieme per ottenere le intuizioni di cui abbiamo bisogno. **Renoir** fornisce un insieme di operatori che ti permettono di unire più flussi insieme.

## Join
L'operazione più comune è quella di unire due flussi insieme. L'operatore `join` ti permette di unire due flussi insieme basandoti su una chiave. La chiave viene valutata usando una closure (una per ogni flusso) e due elementi vengono uniti insieme se le chiavi sono uguali.

Questo operatore è simile alla query SQL `SELECT a, b FROM a JOIN b ON keyer1(a) = keyer2(b)`.

```rust
let s1 = env.stream_iter(0..5u8);
let s2 = env.stream_iter(0..5i32);
let res = s1.join(s2, |n| (n % 5) as i32, |n| n % 2).drop_key().collect_vec();
```
**Renoir** offre anche altre due varianti dell'operatore `join`:
- `left_join` che mantiene tutti gli elementi del flusso di sinistra e gli elementi del flusso di destra che hanno una chiave corrispondente.
- `outer_join` che mantiene tutti gli elementi di entrambi i flussi e gli elementi del flusso di destra che hanno una chiave corrispondente.
- `interval_join` che permette di unire due flussi basandosi su un intervallo di tempo. Gli elementi del flusso di destra vengono uniti con l'elemento del flusso di sinistra se il loro timestamp è all'interno di un intervallo centrato sul timestamp dell'elemento di sinistra.

L'operatore `join` è disponibile anche per `KeyedStream`, in quel caso la chiave è quella utilizzata per partizionare il flusso.

> Un utente più esperto potrebbe voler utilizzare l'operatore `join_with` che permette di personalizzare il comportamento del join. Puoi selezionare quale strategia di spedizione e quale strategia locale utilizzare. Una lista completa delle possibili condizioni di join può essere trovata nella [documentazione dell'API Join_With](https://deib-polimi.github.io/renoir/renoir/struct.Stream.html#method.join_with).

## Merge
L'operatore `merge` ti permette di unire due flussi insieme. L'operatore prende due flussi e restituisce un nuovo flusso che contiene tutti gli elementi dei due flussi. Gli elementi non sono ordinati in alcun modo.

```rust
let s1 = env.stream_iter(0..10);
let s2 = env.stream_iter(10..20);
let res = s1.merge(s2).collect_vec();
```

## Zip
L'operatore `zip` ti permette di unire due flussi insieme. L'operatore prende due flussi e restituisce un nuovo flusso che contiene gli elementi dei due flussi zippati insieme. Gli elementi sono ordinati nello stesso modo in cui sono prodotti dai due flussi.

```rust
let s1 = env.stream_iter((vec!['A', 'B', 'C', 'D'].into_iter()));
let s2 = env.stream_iter((vec![1, 2, 3].into_iter()));
let res = s1.zip(s2).collect_vec();
```

> Tutti gli elementi dopo la fine del flusso più corto verranno scartati