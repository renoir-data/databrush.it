### Esempi

#### Conteggio Parole

```rs
use renoir::prelude::*;

fn main() {
    // Metodo di convenienza per analizzare la configurazione di deployment dagli argomenti CLI
    let (config, args) = RuntimeConfig::from_args();
    config.spawn_remote_workers();
    let env = StreamContext::new(config);

    let result = env
        // Apri e leggi il file riga per riga in parallelo
        .stream_file(&args[0])
        // Dividi in parole
        .flat_map(|line| tokenize(&line))
        // Partiziona
        .group_by(|word| word.clone())
        // Conta le occorrenze
        .fold(0, |count, _word| *count += 1)
        // Raccogli il risultato
        .collect_vec();
        
    env.execute_blocking(); // Inizia l'esecuzione (bloccante)
    if let Some(result) = result.get() {
        // Stampa il conteggio delle parole
        result.into_iter().for_each(|(word, count)| println!("{word}: {count}"));
    }
}

fn tokenize(s: &str) -> Vec<String> {
    // Strategia di tokenizzazione semplice
    s.split_whitespace().map(str::to_lowercase).collect()
}

// Esegui su 6 host locali `cargo run -- -l 6 input.txt`
```

#### Conteggio Parole associativo (più veloce)


```rs
use renoir::prelude::*;

fn main() {
    // Metodo di convenienza per analizzare la configurazione di deployment dagli argomenti CLI
    let (config, args) = RuntimeConfig::from_args();
    let env = StreamContext::new(config);

    let result = env
        .stream_file(&args[0])
        // Il batching adattivo (default) ha latenza prevedibile
        // Il batching di dimensione fissa spesso porta a tempi di esecuzione più brevi
        // Se i dati sono immediatamente disponibili e la latenza non è critica
        .batch_mode(BatchMode::fixed(1024))
        .flat_map(move |line| tokenize(&line))
        .map(|word| (word, 1))
        // Gli operatori associativi dividono l'operazione in un passo locale e uno
        // globale per un'esecuzione più veloce
        .group_by_reduce(|w| w.clone(), |(_w1, c1), (_w2, c2)| *c1 += c2)
        .unkey()
        .collect_vec();

    env.execute_blocking(); // Inizia l'esecuzione (bloccante)
    if let Some(result) = result.get() {
        // Stampa il conteggio delle parole
        result.into_iter().for_each(|(word, count)| println!("{word}: {count}"));
    }
}

fn tokenize(s: &str) -> Vec<String> {
    s.split_whitespace().map(str::to_lowercase).collect()
}

// Esegui su più host `cargo run -- -r config.toml input.txt`
```

### Deployment remoto

```toml
# config.toml
[[host]]
address = "host1.lan"
base_port = 9500
num_cores = 16

[[host]]
address = "host2.lan"
base_port = 9500
num_cores = 24
ssh = { username = "renoir", key_file = "/home/renoir/.ssh/id_ed25519" }
```

Fai riferimento alla directory [examples](https://github.com/deib-polimi/renoir/tree/master/examples) per un set esteso di esempi funzionanti