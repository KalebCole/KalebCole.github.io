---
title: "GitHub Copilot canvases and self-modifying software"
date: 2026-07-16
description: "How Copilot's extension model evolved into canvases, and why agent interfaces should adapt to our workflows."
tags: ["github-copilot", "agents", "developer-tools"]
draft: false
---

I am enamored with a new feature in the [GitHub Copilot app](https://github.com/features/ai/github-app): canvases.

A canvas is a custom interface that an agent can open inside the app. Instead of forcing every task through a chat window or terminal, an extension can give the work an interface that fits it: a kanban board, a triage queue, a visualization, or something nobody has built yet.

Here is a small canvas demo:

<video controls playsinline preload="metadata" src="/blog/copilot-canvases/canvas-demo.mp4">
  Your browser does not support embedded video. You can
  <a href="/blog/copilot-canvases/canvas-demo.mp4">download the demo instead</a>.
</video>

GitHub's documentation explains [how to work with canvas extensions](https://docs.github.com/en/copilot/how-tos/github-copilot-app/working-with-canvas-extensions). I want to focus on where I think the idea came from, because canvases feel like the next tier of *self-modifying software*.

## Start with the workflow, not the agent

Mario Zechner, the creator of [Pi](https://pi.dev/), introduced me to the idea of self-modifying software during an [AI Engineer talk](https://www.youtube.com/watch?v=RjfbvDXpFls&t=359s).

He described how Claude Code could change the context around your work by updating its system prompt and tools. Mario even built [cchistory](https://mariozechner.at/posts/2025-08-03-cchistory/) to track those changes. When dynamic workflows arrived, for example, mentioning a "workflow" could cause the agent to spin up more agents and consume a surprising number of tokens.

His larger point stuck with me: everyone was reshaping their work for coding agents. Everything had to become terminal-first. Why not reshape the agent for the work instead?

Every project has different needs, interfaces, and processes. The agent should respect that.

Pi puts this idea into practice. It is a CLI and terminal UI that can be modified through [Pi extensions](https://pi.dev/packages). You are still working within a terminal, but you can change the interface and add capabilities that fit your workflow.

## From extensions to canvases

Not long after Pi began getting more attention, the Copilot CLI team introduced extensions. The team had decoupled the [agent harness](https://martinfowler.com/articles/harness-engineering.html) from the terminal interface and created the [GitHub Copilot SDK](https://github.com/github/copilot-sdk).

The SDK's [Node.js extension documentation](https://github.com/github/copilot-sdk/blob/main/nodejs/docs/extensions.md) is the best place to start if you want to build one. Be specific when asking an agent for help with these extensions, because "Copilot extension" can also refer to the apps in the [GitHub Marketplace](https://github.com/marketplace?type=apps&copilot_app=true).

Here is my mental model:

1. Starting a Copilot CLI session spawns a separate extension process with bidirectional communication to the session.
2. The extension can observe tool calls, send tool calls to the agent, and expose state that the agent can create, read, update, and delete.

That opened up plenty of ways to extend the CLI harness. One example, built by [Casey Irvine](https://caseyirvine.dev/), is [ADO Build Watcher](https://github.com/cirvine-MSFT/copilot-toolkit/tree/main/extensions/ado-build-watcher). It polls an Azure DevOps pipeline run and injects the result back into the Copilot session.

Then Steve Sanderson, who works on Copilot CLI, began sharing UI-based extensions. His open source [Copilot webview creator](https://github.com/SteveSandersonMS/copilot-webview-creator) adds a custom graphical interface to the CLI. He also recorded a walkthrough, [How to extend Copilot CLI with custom UI](https://www.youtube.com/watch?v=HcjUnrS41II).

![Three custom Copilot extension windows: a todo board, a session event viewer, and a terminal-based architecture view.](/blog/copilot-canvases/copilot-webview-extension.png)

This proved that a CLI extension could have a visual interface, but it also exposed a UX problem: the conversation and the interface lived on two different surfaces.

Canvases bring them together.

## A canvas is an extension with a home

Given that history, canvases make sense to me as the next step. A canvas is a GitHub Copilot extension with a `canvas.json` manifest that lets it render inside the GitHub Copilot desktop app.

That is the useful simplification: if you understand extensions, you already understand most of canvases. The difference is that the custom UI now lives beside the agent instead of in a separate window.

Two examples are worth opening for inspiration:

- [Backlog Swipe Triage](https://awesome-copilot.github.com/extension/backlog-swipe-triage/)
- [Repository Issues Kanban](https://awesome-copilot.github.com/extension/accessibility-kanban/)

I have not built a genuinely useful canvas of my own yet. That is also why I am excited about them. The interesting part is not another predefined interface. It is software that can shape its interface around the work, while you and the agent are doing it.
