# Security Policy

## Supported versions

The latest published `main` branch is supported. Older tagged releases
are not patched.

## Reporting a vulnerability

Please report security issues privately to **security@aicontrolscatalog.dev**.

Include:

- A description of the issue
- Steps to reproduce
- The version (commit SHA) affected
- Your contact information for follow-up

We will acknowledge receipt within 5 business days and aim to issue a
patch or mitigation within 30 days for confirmed issues.

## Scope

This repository is a static site (no backend, no databases, no user
auth). Security issues most likely to affect users are:

- XSS in rendered content (e.g., an injected `<script>` in a control
  field that escapes our sanitization)
- Supply-chain risk in build dependencies
- Schema validation gaps that allow malformed content to be published

Out of scope: third-party services you may host this site through (e.g.,
GitHub Pages, custom CDNs).
