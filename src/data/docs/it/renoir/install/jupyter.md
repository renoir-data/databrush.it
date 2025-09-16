---
title: "Installazione del Kernel Jupyter (Opzionale)"
order: 1
---

## Prerequisiti

Installa Rust seguendo la [guida di installazione](../install)

## Evcxr

I programmi Rust possono anche essere eseguiti in un ambiente interattivo.
[**Evcxr**](https://github.com/evcxr/evcxr) è un contesto di valutazione per Rust e fornisce un REPL (analogo a ipython), e un Kernel Jupyter.

## Installazione del Kernel Jupyter

> [Guida ufficiale](https://github.com/evcxr/evcxr/blob/main/evcxr_jupyter/README.md)

I passaggi per installare il kernel jupyter sono i seguenti:

1. Installa il binario `evcxr_jupyter`: `cargo install --locked evcxr_jupyter`
2. Installa il kernel: `evcxr_jupyter --install` (Nota: assicurati che `$HOME/.cargo/bin` sia nella tua variabile `PATH`)

## Utilizzare il Kernel Jupyter in Visual Studio Code

> [Guida ufficiale](https://code.visualstudio.com/docs/datascience/jupyter-notebooks)

1. Installa il pacchetto `jupyter` nel tuo ambiente python
2. Installa l'[estensione Jupyter per VS Code](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)
3. Crea un nuovo file `.ipynb` e aprilo
4. Seleziona il Kernel Jupyter
    1. Clicca sul pulsante *Select Kernel* in alto a destra
    2. Scegli *Jupyter Kernel ...*
    3. Scegli il kernel Rust evcxr che hai installato prima

## Importare dipendenze

Ora che hai selezionato il kernel puoi iniziare a scrivere codice ed eseguirlo.
Per importare dipendenze puoi utilizzare la parola chiave `:dep`[^1].

[^1]: segue la stessa sintassi di cargo toml

```txt
:dep renoir = { git = "https://github.com/deib-polimi/renoir" }
```

Ora con un'istruzione `use` possiamo importare quello che ci serve per utilizzare renoir.

```rust
use renoir::prelude::*;
```

### Prelude raccomandato

Il kernel evcxr può essere configurato usando parole chiave speciali secondo le tue necessità. Elenchiamo alcune delle modifiche più utili che puoi fare (queste possono essere messe in una cella all'inizio del notebook)

+ `:cache SIZE` Imposta la dimensione della cache in MiB (usa per una compilazione più veloce)
+ `:opt LEVEL` Imposta il livello di ottimizzazione, il default è nessuna ottimizzazione (per un'esecuzione più veloce usa 1,2 o 3)

## Esempio

```rust
:cache 500
:opt 1
:dep renoir = { git = "https://github.com/deib-polimi/renoir" }
use renoir::prelude::*;
```

```rust
let ctx = StreamContext::new_local();

let result = ctx.stream_par_iter(0..100)
    .map(|x| (x, x * x))
    .collect_vec();

ctx.execute_blocking();
let output = result.get()
```

```rust
// La parola chiave :vars stamperà le variabili che hai impostato (Nota: le regole di lifetime di Rust si applicano ancora!)
:vars
```

| | |
|-|-|
| Variabile | Tipo |
| output | Option<Vec<(i32,i32)>> |

```rust
println!("{output:?}");
```

*Some([(0, 0), (1, 1), (2, 4), (3, 9), (4, 16), (5, 25), (6, 36), (7, 49), (8, ...*