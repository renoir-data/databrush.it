---
title: Da Flink a Renoir
order: 2
---

> Questa guida presuppone che tu abbia già configurato un ambiente per Renoir e creato un progetto cargo seguendo la [guida](../../install/install)

> Questa introduzione rapida segue un approccio pratico mostrando esempi che confrontano l'API di Flink con l'API di Renoir

Se conosci Apache Flink, troverai facile iniziare ad usare Renoir.

Proprio come in Flink, i calcoli in Renoir sono definiti come un grafo di operatori, dove i dati fluiscono da un operatore all'altro.

## Iniziamo: Wordcount

Come primo compito implementeremo un'applicazione per il conteggio delle parole sia in Flink che in Renoir. L'obiettivo è leggere un file e contare le occorrenze di tutte le parole distinte contenute in esso.

#### Flink

```java
// Imports...
public class WordCount {
    public static void main(String[] args) throws Exception {
        final ExecutionEnvironment env = ExecutionEnvironment.getExecutionEnvironment();

        long start = System.nanoTime();

        DataSet < String > text = env.readTextFile("text-file.txt");

        DataSet < Tuple2 < String, Integer >> counts =
            text.flatMap((value, collector) - > {
                String[] token = value.split("\\s+");
                for (String token: tokens) {
                    if (token.length() > 0) {
                        out.collect(new Tuple2 < > (token.toLowerCase(), 1));
                    }
                }
            })
            // raggruppa per il campo della tupla "0" e somma il campo della tupla "1"
            .groupBy(0)
            .sum(1);
        counts.count();

        long stop = System.nanoTime();
        System.out.printf("total:%d", stop - start);

        counts.sort(Comparator.comparing((t) - > getCount(t)));
        for (Tuple2 < String, Integer > tuple: counts) {
            System.out.printf("%s %d\n", tuple.f0, tuple.f1);
        }
    }
}

```

#### Renoir

```rust
use renoir::prelude::*;

fn main() {
    let ctx = StreamContext::new_local();

    let result = ctx
        .stream_file("/etc/passwd")
        .flat_map(|line| {
            line.split_whitespace()
                .map(|t| t.to_lowercase())
                .collect::<Vec<String>>()
        })
        .group_by_count(|word: &String| word.clone())
        .collect_vec();

    let start = Instant::now();
    ctx.execute_blocking();
    let elapsed = start.elapsed();

    if let Some(mut res) = result.get() {
        res.sort_by_key(|t| t.1);
        println!("{res:#?}");
    }
    println!("{elapsed:?}");
}

```

# WIP: Questa guida è ancora incompleta