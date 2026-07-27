```markdown
# AI-Controls-Catalog Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development conventions and workflows used in the `AI-Controls-Catalog` repository, a TypeScript project built with the Astro framework. You'll learn how to write code that matches the project's style, structure your commits, and understand the testing patterns in use.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `controlButton.ts`, `aiWidgetList.ts`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```typescript
    import { ControlButton } from './controlButton';
    ```

### Export Style
- Use **named exports** for all modules.
  - Example:
    ```typescript
    export const ControlButton = () => { /* ... */ };
    ```

### Commit Messages
- Follow **conventional commit** format.
- Use the `feat` prefix for new features.
- Keep commit messages concise (average 24 characters).
  - Example:  
    ```
    feat: add toggle switch control
    ```

## Workflows

### Adding a New Control Component
**Trigger:** When you need to add a new UI control to the catalog  
**Command:** `/add-control`

1. Create a new file in camelCase (e.g., `myNewControl.ts`).
2. Implement the component using TypeScript and Astro conventions.
3. Use relative imports for dependencies.
4. Export the component using a named export.
5. Write a corresponding test file (e.g., `myNewControl.test.ts`).
6. Commit with a conventional message:
   ```
   feat: add my new control
   ```

### Updating an Existing Component
**Trigger:** When modifying or enhancing an existing control  
**Command:** `/update-control`

1. Locate the component file using camelCase naming.
2. Make your changes, following the import/export conventions.
3. Update or add tests as needed.
4. Commit with a descriptive, conventional message:
   ```
   feat: update control with new prop
   ```

## Testing Patterns

- Test files use the pattern `*.test.*` (e.g., `controlButton.test.ts`).
- The testing framework is **unknown**; check existing test files for structure.
- Place tests alongside or near the component files.
- Example test file name: `aiWidgetList.test.ts`

## Commands
| Command         | Purpose                                         |
|-----------------|-------------------------------------------------|
| /add-control    | Scaffold and add a new control component        |
| /update-control | Update or enhance an existing control component |
```
