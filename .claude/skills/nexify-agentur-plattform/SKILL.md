```markdown
# nexify-agentur-plattform Development Patterns

> Auto-generated skill from repository analysis

## Overview
<<<<<<< HEAD
This skill provides a comprehensive guide to the development patterns, coding conventions, and workflows found in the `nexify-agentur-plattform` Python codebase. It covers file organization, code style, commit conventions, and project maintenance workflows to help contributors maintain consistency and quality.
=======

This skill introduces the core development patterns and workflows used in the `nexify-agentur-plattform` Python codebase. It covers coding conventions, commit practices, and detailed instructions for the most common repository workflows, such as integrating new agent/skill bundles, updating CI/CD pipelines, and managing monorepo workspace configuration. This guide is intended for contributors seeking to maintain consistency and efficiency across the project.
>>>>>>> origin/main

## Coding Conventions

### File Naming
<<<<<<< HEAD
- Use **snake_case** for all file and module names.
  - Example: `user_profile.py`, `data_utils.py`

### Import Style
- Use **relative imports** within the package.
  - Example:
    ```python
    from .models import User
    from ..utils import parse_date
    ```

### Export Style
- Use **named exports** (explicitly define what is exported).
  - Example:
    ```python
    __all__ = ["User", "parse_date"]
    ```

### Commit Messages
- Follow **conventional commit** style.
- Allowed prefixes: `chore`, `feat`, `fix`
- Example:
  ```
  feat: add user authentication to login endpoint
  fix: correct typo in email validation
  chore: update dependencies for security patches
  ```

## Workflows

### Project Snapshot or Cleanup
**Trigger:** When initializing a new repository state or performing a mass cleanup (e.g., removing problematic files for cross-platform compatibility).
**Command:** `/snapshot-cleanup`

1. **Identify** files that need to be removed or cleaned (e.g., files with invalid path characters).
2. **Remove or update** those files across the codebase.
3. **Commit** all changes in a single large commit with a `chore/cleanup` message.
   - Example commit message:
     ```
     chore: cleanup files for cross-platform compatibility
     ```
4. **Verify** that the repository is in a clean, consistent state.

**Files Involved:**
- `.gitignore`
- `.gitlab-ci.yml`
- `.github/workflows/*`
- `apps/hermes/**`
- `README.md`
- `docs/**`

**Frequency:** Rare (typically during initial setup or major maintenance).

## Testing Patterns

- **Testing framework:** Unknown (no standard Python test framework detected).
- **Test file pattern:** `*.test.ts` (suggests some TypeScript tests may exist, possibly for frontend or integration).
- **Recommendation:** For Python code, use `pytest` or `unittest` and place tests in files like `test_module.py`.

## Commands

| Command            | Purpose                                                        |
|--------------------|----------------------------------------------------------------|
| /snapshot-cleanup  | Create a clean project snapshot or perform mass cleanup tasks. |

```
=======

- Use **snake_case** for Python files and modules.
  - Example: `agent_utils.py`, `data_loader.py`

### Import Style

- Prefer **relative imports** within the package.
  - Example:
    ```python
    from .utils import load_config
    from ..models import Agent
    ```

### Export Style

- Use **named exports** by defining `__all__` in modules where necessary.
  - Example:
    ```python
    __all__ = ["Agent", "Skill"]
    ```

### Commit Messages

- Follow **conventional commit** format:
  - Prefixes: `feat`, `fix`, `chore`, `docs`, `refactor`
  - Example:
    ```
    feat(agent): add ECC bundle integration workflow
    fix(ci): correct deploy-vps job environment variable
    ```

## Workflows

### ECC Bundle Integration

**Trigger:** When you want to add a new ECC bundle (agent/skill) to the platform  
**Command:** `/add-ecc-bundle`

1. Add or update `.claude/ecc-tools.json` with new tool metadata.
2. Add or update `.claude/identity.json` for agent/skill identity.
3. Add or update `.claude/skills/[skill-name]/SKILL.md` with skill documentation.
4. Add or update `.claude/homunculus/instincts/inherited/[skill-name]-instincts.yaml` for inherited instincts.
5. Add or update `.claude/commands/project-snapshot-or-cleanup.md` for project management commands.
6. Add or update `.codex/config.toml` for codex configuration.
7. Add or update `.codex/AGENTS.md` to register the new agent.
8. Add or update `.codex/agents/[agent].toml` for agent-specific config.
9. Add or update `.agents/skills/[skill-name]/SKILL.md` for agent skill documentation.
10. Add or update `.agents/skills/[skill-name]/agents/openai.yaml` for OpenAI agent configuration.

**Example Directory Structure:**
```
.claude/
  ecc-tools.json
  identity.json
  skills/
    my_skill/
      SKILL.md
  homunculus/
    instincts/
      inherited/
        my_skill-instincts.yaml
.codex/
  config.toml
  AGENTS.md
  agents/
    my_agent.toml
.agents/
  skills/
    my_skill/
      SKILL.md
      agents/
        openai.yaml
```

---

### CI/CD Workflow Update

**Trigger:** When you need to fix, expand, or add CI/CD automation for backend/frontend or infrastructure  
**Command:** `/update-ci-cd`

1. Edit `.github/workflows/*.yml` to add or fix jobs (e.g., `ci.yml`, `deploy-vps.yml`).
2. Edit `.gitlab-ci.yml` for GitLab pipeline changes.
3. Update `.gitignore` if new workflow artifacts are generated.
4. Add or update documentation (e.g., `docs/architecture/DEVIATION-REPORT-*.md`, `docs/operations/REPO-SYNC-STRATEGY.md`).
5. Add or update deployment/sync scripts (e.g., `scripts/sync-workspace-to-vps.sh`).
6. Commit and push changes to trigger the new workflow runs.

**Example:**
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest
```

---

### Monorepo Workspace Config

**Trigger:** When you want to add new apps/packages to the monorepo or fix workspace-related CI errors  
**Command:** `/add-workspace-app`

1. Edit or create `pnpm-workspace.yaml` to include new packages/apps.
2. Edit or create the root `package.json` with workspace metadata and scripts.
3. Commit and push to validate via CI.

**Example:**
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
// package.json
{
  "name": "nexify-agentur-plattform",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test"
  }
}
```

## Testing Patterns

- **Framework:** Unknown (no standard detected)
- **Test File Pattern:** `*.test.ts`
- Tests are likely written in TypeScript using a common test runner (e.g., Jest or Vitest).
- Place test files alongside source files or in a dedicated `tests/` directory.
- Example test file: `agent_utils.test.ts`

## Commands

| Command            | Purpose                                                      |
|--------------------|--------------------------------------------------------------|
| /add-ecc-bundle    | Integrate a new ECC bundle (agent/skill) into the platform   |
| /update-ci-cd      | Update or expand CI/CD workflows and related documentation   |
| /add-workspace-app | Add new apps/packages to the monorepo workspace configuration|
```
>>>>>>> origin/main
