---
title: "Installazione e creazione di un progetto Renoir"
order: 0
---

Il primo requisito per costruire un progetto Renoir è la **toolchain Rust**.

## Installazione di Rust

+ **Usando Rustup (Raccomandato)**: segui le istruzioni su <https://rustup.rs/>
  + Linux (Raccomandato):

    ```bash
    ~$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```

  + Windows: Scarica ed esegui l'installer
+ **Usando il tuo package manager**: in alternativa puoi usare il pacchetto fornito dal tuo repository

## Aggiungi la toolchain rust al PATH

Per poter usare tutti gli strumenti della toolchain Rust dobbiamo aggiungere la cartella "~/.cargo/bin/" nel nostro PATH

+ **bash**:

```bash
~$ echo 'export PATH=$PATH:~/.cargo/bin/' >> ~/.bashrc
```

+ **fish**:

```bash
~$ set -xU fish_user_paths $fish_user_paths ~/.cargo/bin/
```

## Crea un nuovo progetto cargo

Dopo aver installato con successo la toolchain Rust siamo pronti a creare meraviglie con **Renoir**.
Per farlo creeremo un nuovo progetto aggiungendo **Renoir** alle sue dipendenze.

```sh
cargo new --bin renoir-test
cd renoir-test
 # Aggiungi la dipendenza renoir al `Cargo.toml`
 # Attualmente raccomandiamo di usare il repository GitHub direttamente
cargo add renoir --git https://github.com/deib-polimi/renoir
```

Ora puoi aprire il progetto nel tuo editor preferito e iniziare a scrivere la tua applicazione usando Renoir!

> Suggerimento Bonus: [Ambiente di Sviluppo](/book/appendix/editor)