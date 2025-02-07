---
title: The Renoir Book
order: 0
---

## Renoir

[Preprint](https://arxiv.org/abs/2306.04421)

### REactive Network of Operators In Rust

[API Docs](https://databrush.it/docs/renoir/)

Renoir *(short: Noir)  [/ʁənwaʁ/, /nwaʁ/]* is a distributed data processing platform based on the dataflow paradigm that provides an ergonomic programming interface, similar to that of Apache Flink, but has much better performance characteristics.

Renoir converts each job into a dataflow graph of
operators and groups them in blocks. Blocks contain a sequence of operors which process the data sequentially without repartitioning it. They are the deployment unit used by the system and can be distributed and executed on multiple systems.

The common layout of a Renoir program starts with the creation of a `StreamContext`, then one or more `Source`s are initialised creating a `Stream`. The graph of operators is composed using the methods of the `Stream` object, which follow a similar approach to Rust's `Iterator` trait allowing ergonomically define a processing workflow through method chaining.

### Examples

#### Wordcount

```rs
use renoir::prelude::*;

fn main() {
    // Convenience method to parse deployment config from CLI arguments
    let (config, args) = RuntimeConfig::from_args();
    config.spawn_remote_workers();
    let env = StreamContext::new(config);

    let result = env
        // Open and read file line by line in parallel
        .stream_file(&args[1])
        // Split into words
        .flat_map(|line| tokenize(&line))
        // Partition
        .group_by(|word| word.clone())
        // Count occurrences
        .fold(0, |count, _word| *count += 1)
        // Collect result
        .collect_vec();
        
    env.execute_blocking(); // Start execution (blocking)
    if let Some(result) = result.get() {
        // Print word counts
        result.into_iter().for_each(|(word, count)| println!("{word}: {count}"));
    }
}

fn tokenize(s: &str) -> Vec<String> {
    // Simple tokenisation strategy
    s.split_whitespace().map(str::to_lowercase).collect()
}

// Execute on 6 local hosts `cargo run -- -l 6 input.txt`
```

#### Wordcount associative (faster)

```rs
use renoir::prelude::*;

fn main() {
    // Convenience method to parse deployment config from CLI arguments
    let (config, args) = RuntimeConfig::from_args();
    let env = StreamContext::new(config);

    let result = env
        .stream_file(&args[1])
        // Adaptive batching(default) has predictable latency
        // Fixed size batching often leads to shorter execution times
        // If data is immediately available and latency is not critical
        .batch_mode(BatchMode::fixed(1024))
        .flat_map(move |line| tokenize(&line))
        .map(|word| (word, 1))
        // Associative operators split the operation in a local and a
        // global step for faster execution
        .group_by_reduce(|w| w.clone(), |(_w1, c1), (_w2, c2)| *c1 += c2)
        .unkey()
        .collect_vec();

    env.execute_blocking(); // Start execution (blocking)
    if let Some(result) = result.get() {
        // Print word counts
        result.into_iter().for_each(|(_, (word, count))| println!("{word}: {count}"));
    }
}

fn tokenize(s: &str) -> Vec<String> {
    s.split_whitespace().map(str::to_lowercase).collect()
}

// Execute on multiple hosts `cargo run -- -r config.toml input.txt`
```

### Remote deployment

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

Refer to the [examples](examples/) directory for an extended set of working examples
