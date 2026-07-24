```markdown
# nexify-agentur-plattform Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill provides a comprehensive guide to the development patterns, coding conventions, and workflows found in the `nexify-agentur-plattform` Python codebase. It covers file organization, code style, commit conventions, and project maintenance workflows to help contributors maintain consistency and quality.

## Coding Conventions

### File Naming
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