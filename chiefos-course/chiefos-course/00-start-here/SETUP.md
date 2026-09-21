# Machine Setup

Install these before Week 1. Free tiers everywhere. Ask in the class channel if stuck —
setup problems are normal and not a reflection of ability.

> **Do not try to understand these tools yet.** Just install them. Week 1 onward explains
> each one as you need it.

---

## Required

| Tool | What it is (one line) | Get it |
|------|----------------------|--------|
| **A terminal** | Where you type commands | macOS: Terminal (built in) · Windows: install **Windows Terminal** + **WSL2** (Ubuntu) |
| **Git** | Tracks versions of your code | https://git-scm.com/downloads |
| **VS Code** | The editor you'll write in | https://code.visualstudio.com |
| **GitHub account** | Where your code lives online | https://github.com/signup |
| **Docker Desktop** | Runs apps in isolated boxes (Week 6) | https://www.docker.com/products/docker-desktop |
| **Node.js (LTS)** | Runs JavaScript apps (Phase 3) | https://nodejs.org |
| **An AI coding assistant** | Your pair partner (Week 7+) | Claude, GitHub Copilot, or Cursor — any free tier |

---

## Windows users: do this first

Install **WSL2** (Windows Subsystem for Linux). It gives you a real Linux terminal, which
is what the whole industry — and ChiefOS — runs on. PowerShell works for some things, but
this course uses a Linux shell so everyone is on the same commands.

```powershell
# Run in PowerShell as Administrator, then restart:
wsl --install
```

After restart, open **Ubuntu** from the Start menu and follow the Linux instructions for
Git/Node inside it.

---

## Verify your setup

Open your terminal and run each line. You should get a version number, not an error.

```bash
git --version
node --version
docker --version
code --version
```

If all four print versions, you're ready. If not, that's what Week 0 office hours are for.

---

## Accounts checklist

- [ ] GitHub account created, username: ____________
- [ ] Signed into VS Code
- [ ] Docker Desktop installed and **running** (whale icon in your tray/menubar)
- [ ] AI assistant account created

Bring this checklist, completed, to Week 1.
