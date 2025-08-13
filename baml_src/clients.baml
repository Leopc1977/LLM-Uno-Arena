// https://docs.boundaryml.com/docs/snippets/clients/retry
retry_policy Constant {
  max_retries 3
  // Strategy is optional
  strategy {
    type constant_delay
    delay_ms 200
  }
}

retry_policy Exponential {
  max_retries 2
  // Strategy is optional
  strategy {
    type exponential_backoff
    delay_ms 300
    multiplier 1.5
    max_delay_ms 10000
  }
}

client<llm> Llama3 {
  provider ollama
  options {
    base_url "http://localhost:11434/v1"
    model "llama3.2"
  }
}

client<llm> Gemma3 {
  provider ollama
  options {
    base_url "http://localhost:11434/v1"
    model "Gemma3"
  }
}

client<llm> Deepseek {
  provider ollama
  options {
    base_url "http://localhost:11434/v1"
    model "deepseek-r1:1.5b"
    think false
    stream false
  }
}

client<llm> Qwen3 {
  provider ollama
  options {
    base_url "http://localhost:11434/v1"
    model "qwen3:0.6b"
    think false
    stream false
  }
}
