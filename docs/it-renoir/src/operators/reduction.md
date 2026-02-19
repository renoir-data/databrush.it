Per ottenere informazioni da uno stream di dati è spesso necessario aggregare i dati in qualche modo. **Renoir** fornisce un set di operatori che ti permettono di eseguire riduzioni e fold sui stream di dati per ottenere le informazioni desiderate.

## Reduce
L'operatore `reduce` aggrega i dati di uno stream seguendo una funzione definita dall'utente ed emette un singolo valore. La funzione dovrebbe modificare l'accumulatore che alla fine sarà il valore emesso.

```rust
let s = env.stream_iter(0..5);
let res = s.reduce(|acc, value| acc + value).collect::<Vec<_>>();

env.execute_blocking();

assert_eq!(res.get().unwrap(), vec![0 + 1 + 2 + 3 + 4]);
```

> Nota che il tipo dell'accumulatore è lo stesso del tipo degli elementi dello stream. Se è necessario un tipo diverso considera l'uso di `fold`.

## Reduce Associativo
L'operatore `reduce_assoc` è una variante dell'operatore `reduce` che può essere usato quando la funzione di riduzione è associativa. Questo permette all'operatore di essere eseguito in parallelo e può essere più efficiente dell'operatore `reduce`.

L'operatore applica la funzione di riduzione in due passi:
 - **Local**: la funzione che sarà eseguita su ogni replica.
 - **Global**: la funzione che aggregherà tutti i risultati parziali ottenuti dalle funzioni locali.

```rust
let s = env.stream_iter(0..5);
let res = s.reduce_assoc(|acc, value| acc + value).collect_vec();

env.execute_blocking();

assert_eq!(res.get().unwrap(), vec![0 + 1 + 2 + 3 + 4]);
```

> Nota che il tipo dell'accumulatore è lo stesso del tipo degli elementi dello stream. Se è necessario un tipo diverso considera l'uso di `fold_assoc`.

## Fold
L'operatore `fold` aggrega i dati di uno stream seguendo una funzione definita dall'utente ed emette un singolo valore. La funzione dovrebbe modificare l'accumulatore che alla fine sarà il valore emesso. È simile all'operatore `reduce` ma permette di specificare un valore iniziale e quindi il tipo per l'accumulatore.

```rust
let s = env.stream_iter(0..5);
let res = s.fold(0, |acc, value| *acc += value).collect_vec();

env.execute_blocking();

assert_eq!(res.get().unwrap(), vec![0 + 1 + 2 + 3 + 4]);
```

## Fold Associativo
L'operatore `fold_assoc` è una variante dell'operatore `fold` che può essere usato quando la funzione di riduzione è associativa. Simile al `reduce_assoc`, questo permette all'operatore di essere eseguito in parallelo e può essere più efficiente dell'operatore `fold`.

L'operatore richiede due funzioni definite dall'utente:
 - **Local**: la funzione che sarà eseguita su ogni replica.
 - **Global**: la funzione che aggregherà tutti i risultati parziali ottenuti dalle funzioni locali.

```rust
// Esempio
let s = env.stream_iter(0..5);
let res = s.fold_assoc(0, |acc, value| *acc += value, |acc, value| *acc += value).collect_vec();

env.execute_blocking();

assert_eq!(res.get().unwrap(), vec![0 + 1 + 2 + 3 + 4]);
```