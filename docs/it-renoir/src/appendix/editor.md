Se hai già configurato un ambiente di sviluppo con cui ti trovi a tuo agio ti consigliamo di rimanere con quello che trovi più produttivo. Altrimenti, se questa è la tua prima esperienza di programmazione con Rust o stai cercando idee per migliorare la tua produttività, questa pagina ti mostrerà come puoi configurare un ambiente di sviluppo efficace per Rust e Renoir.

# Configurare un ambiente usando VS Code

Prima di tutto, raccomanderei di lavorare in un sistema UNIX se possibile[^1], se sei su Windows potresti provare ad usare Windows Subsystem for Linux (WSL) per un'esperienza migliore.

[^1]: Attualmente sto usando [Fedora KDE](https://fedoraproject.org/spins/kde/) e ho usato [Kubuntu](https://kubuntu.org/) in passato

Come IDE, uso [VS Code](https://code.visualstudio.com/) per lavorare con Rust (Nota: c'è anche un'estensione WSL se sei su windows e vuoi lavorare in WSL)

L'estensione [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) ti porterà quasi tutto quello di cui potresti aver bisogno per lavorare con Rust, c'è anche una [guida ufficiale](https://code.visualstudio.com/docs/languages/rust) su come configurare vs code per Rust.

Oltre a questo raccomando anche l'estensione [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) che si integra bene con rust-analyzer per mostrare errori del compilatore e suggerimenti direttamente inline (Abilita il livello diagnostico hint nelle impostazioni CTRL+, per maggiori dettagli)
Le estensioni [Even Better TOML](https://marketplace.visualstudio.com/items?itemName=tamasfe.even-better-toml) e [Crates](https://marketplace.visualstudio.com/items?itemName=serayuzgur.crates)[^2] per lavorare con il Cargo.toml
[^2]: Questa estensione è attualmente non mantenuta e stiamo cercando raccomandazioni alternative.

Infine per gli strumenti CLI, ricorda di controllare `cargo clippy --all --all-targets` per buone pratiche di codifica (puoi usare la flag `--fix` per applicare automaticamente anche le correzioni) `cargo fmt --all` per formattare il codice e uso anche [cargo-edit](https://github.com/killercup/cargo-edit) per il comando cargo upgrade, che insieme a cargo add può essere utilizzato per gestire il Cargo.toml dal terminale

Quando valuti le prestazioni esegui con la flag `--release`

> Se senti che l'estensione rust-analyzer sta sovraccaricando con informazioni mostrando tutti i suggerimenti di tipo, puoi disabilitarne alcuni, nella mia configurazione ho
> + Imports>Granularity>Group: module
> + Inlay Hints>Chaining Hints>Enable: false 
> +  Inlay Hints>Type Hints>Enable: false

### Altre estensioni consigliate

+ [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb)
+ [Jupyter](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter) se lavori con [evcxr](https://github.com/evcxr/evcxr)