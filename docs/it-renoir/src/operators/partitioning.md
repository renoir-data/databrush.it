La maggior parte delle volte gli elementi in un flusso devono essere raggruppati o partizionati in qualche modo per ottenere il risultato desiderato. **Renoir** fornisce un insieme di operatori che fanno esattamente questo.

# Raggruppamento
## Group By
Probabilmente l'operazione più comune è quella di raggruppare insieme elementi per qualche chiave comune. La chiave può essere estratta dall'elemento stesso o calcolata da esso. L'operatore `group_by` prende una closure che restituisce la chiave per ogni elemento e restituisce un `KeyedStream` dove gli operatori vengono valutati sugli elementi con la stessa chiave.

```rust
let s = env.stream_iter(0..5);
// partiziona elementi pari e dispari
let keyed = s.group_by(|&n| n % 2); 
```

> Dopo il partizionamento tutti gli elementi verranno inviati alla rete per bilanciare il carico ma se il risultato desiderato è un'aggregazione in molti casi è consigliabile utilizzare una variante associativa dell'operatore `group_by` come `group_by_reduce` o `group_by_sum`, una lista completa delle possibili varianti associative può essere trovata nella [documentazione dell'API Group By](https://deib-polimi.github.io/renoir/renoir/struct.Stream.html#method.group_by).

## Key By
> OPERATORE AVANZATO

Crea un nuovo 'KeyedStream' in modo simile all'operatore `group_by` ma senza rimescolare gli elementi sulla rete. **Questo può far comportare male altri operatori**. Probabilmente vuoi utilizzare `group_by` invece.

```rust
let s = env.stream_iter(0..5);
let res = s.key_by(|&n| n % 2).collect_vec();
``` 

# Partizionamento
## Route
A volte c'è bisogno di inviare elementi a rotte diverse basandosi su qualche condizione. L'operatore `route` permette di creare una serie di rotte e inviare gli elementi alla rotta corretta basandosi sulla prima condizione soddisfatta.
- Le rotte vengono create con il metodo `add_route`, viene creato un nuovo flusso per ogni rotta.
- Ogni elemento viene instradato al primo flusso per cui la condizione di instradamento si valuta come true.
- Se nessuna condizione di rotta è soddisfatta, l'elemento viene scartato

```rust
let mut routes = s.route()
 .add_route(|&i| i < 5)
 .add_route(|&i| i % 2 == 0)
 .build()
 .into_iter();
assert_eq!(routes.len(), 2);
// 0 1 2 3 4
routes.next().unwrap().for_each(|i| eprintln!("route1: {i}"));
// 6 8
routes.next().unwrap().for_each(|i| eprintln!("route2: {i}"));
// 5 7 9 ignorati
env.execute_blocking();
```

## Split
Crea più flussi da un singolo flusso dove ogni suddivisione avrà tutti gli elementi del flusso originale. L'operatore `split` è utile quando hai bisogno di applicare trasformazioni diverse allo stesso flusso.

```rust
let s = env.stream_iter(0..5);
let mut splits = s.split(3);
let a = splits.pop().unwrap();
let b = splits.pop().unwrap();
let c = splits.pop().unwrap();
```