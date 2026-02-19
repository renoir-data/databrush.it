In questa sezione vedremo quanto è facile eseguire il calcolo di **Renoir** in parallelo e distribuirlo attraverso più macchine.

Le informazioni sull'ambiente in cui il calcolo verrà eseguito sono memorizzate in un `StreamContext`. Il contesto può contenere più stream e operatori ed è l'oggetto che governa l'esecuzione di tutti gli stream al suo interno.

## Deployment Locale
Per eseguire un calcolo su una singola macchina, puoi creare un `StreamContext` con il metodo `new_local()`.
Questo metodo crea un contesto che eseguirà lo stream usando tutte le risorse disponibili della macchina.

```rust
let ctx = StreamContext::new_local();
// ... Stream e operatori
```

se vuoi specificare il numero di thread da usare, puoi creare un `RuntimeConfig` personalizzato facilmente usando il metodo `local(..)`.

```rust
let config = RuntimeConfig::local(4).unwrap();
let ctx = StreamContext::new(config);
// ... Stream e operatori
```

## Deployment Distribuito
Per eseguire un calcolo su più macchine, puoi creare un `StreamContext` con il metodo `remote(..)`.
Questo metodo prende come argomento il percorso a un file di configurazione (toml) che contiene le informazioni sul cluster.

```rust
let config = RuntimeConfig::remote("path/to/config.toml").unwrap();
config.spawn_remote_workers();
let ctx = StreamContext::new(config);
// ... Stream e operatori
```
> Se vuoi usare un ambiente distribuito devi spawnarli usando `spawn_remote_workers` prima di richiedere qualche stream.

il file di configurazione dovrebbe contenere le informazioni necessarie per connettersi alle varie macchine nel cluster, per esempio:

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
E proprio così la tua pipeline sarà automaticamente distribuita attraverso entrambe le macchine.

> Opzioni disponibili per il `RuntimeConfig` sono:
> - `address`: una stringa con l'indirizzo della macchina
> - `base_port`: porta di partenza per la comunicazione tra operatori su macchine diverse
> - `num_cores`: numero di core disponibili sulla macchina
> - `ssh`: oggetto per memorizzare le informazioni di connessione ssh
>> - `ssh_port`: porta per connettersi alla macchina
>> - `username`: username per connettersi alla macchina
>> - `password`: password per connettersi alla macchina
>> - `key_file`: percorso al file della chiave privata
>> - `key_passphrase`: passphrase per il file della chiave privata

## Contesto dagli Argomenti
Per decidere l'ambiente in cui il calcolo verrà eseguito ogni volta, puoi passare il contesto come argomento al programma.

```rust
let (config, args) = RuntimeConfig::from_args();
let ctx = StreamContext::new(config);
// ... Stream e operatori
```
e quando esegui il programma puoi passare gli argomenti al programma, specificando se vuoi eseguire il calcolo localmente o remotamente.

```bash
cargo run -- --local numero_di_thread
cargo run -- --remote percorso/al/config.toml
``` 

<!-- CUSTOM ENV -->