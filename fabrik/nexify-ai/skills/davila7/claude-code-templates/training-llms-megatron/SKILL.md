---
name: "training-llms-megatron"
description: "Trains large language models (2B-462B parameters) using NVIDIA Megatron-Core with advanced parallelism strategies. Use when training models >1B parameters, need maximum GPU efficiency (47% MFU on H100), or require tensor/pipeline/sequence/context/expert parallelism. Production-ready framework used for Nemotron, LLaMA, DeepSeek."
slug: "training-llms-megatron"
metadata:
  sources:
    -
      kind: "github-dir"
      commit: "5d84483c3d6e4fc1703bc90fd2b8bb0a7953aa9f"
      path: "cli-tool/components/skills/ai-research/distributed-training-megatron-core"
      repo: "davila7/claude-code-templates"
      trackingRef: "main"
      url: "https://github.com/davila7/claude-code-templates.git"
key: "davila7/claude-code-templates/training-llms-megatron"
---

