You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## Color Schema

Always use these Tailwind color utilities defined in `src/routes/layout.css`:

| Color                  | Hex     | Usage                               |
| ---------------------- | ------- | ----------------------------------- |
| `primary`              | #F2B42D | Main brand color (buttons, accents) |
| `primary-foreground`   | #FFFFFF | Text on primary backgrounds         |
| `foreground`           | #131740 | Main text color                     |
| `background`           | #FFFFFF | Page background                     |
| `muted`                | #5A5D79 | Subdued text (subtitles, captions)  |
| `secondary`            | #61C8F3 | Secondary accent color              |
| `secondary-foreground` | #FFFFFF | Text on secondary backgrounds       |
| `tertiary`             | #131740 | Tertiary accent color               |
| `tertiary-foreground`  | #FFFFFF | Text on tertiary backgrounds        |

Example usage:

- Buttons: `bg-primary text-primary-foreground`
- Secondary buttons: `bg-secondary text-secondary-foreground`
- Body text: `text-foreground`
- Page: `bg-background`

**Important:** NEVER use hardcoded hex values (e.g., `text-[#131740]`). Always use theme colors (e.g., `text-tertiary`).

## Fonts

| Font       | Utility           |
| ---------- | ----------------- |
| Inter      | `font-inter`      |
| Montserrat | `font-montserrat` |

## Project Structure

Follow this **Atomic Design + Feature-based** pattern:

```
src/lib/
├── components/          # Reusable UI (Atomic Design)
│   ├── atoms/           # Smallest elements (Button, Input, Icon)
│   ├── molecules/       # Combinations of atoms (FormField, Card)
│   └── organism/        # Complex sections (Navbar, Modal)
│
├── features/            # Feature/domain-specific code
│   └── [feature-name]/
│       ├── [FeatureName].svelte    # Main feature component
│       └── components/             # Feature-specific components
│
└── assets/              # Static assets (images, icons, etc.)
```

**Rules:**

- `components/` = Reusable across the entire app
- `features/` = Domain-specific, only used within that feature
- When creating a new feature, create a folder under `features/` with its own `components/` subfolder
- Atoms are single-purpose (Button, Input, Badge)
- Molecules combine atoms (SearchBar = Input + Button)
- Organisms are complex UI sections (Navbar, Footer)

## Scripts

Run these commands after making changes:

| Command          | Description                         |
| ---------------- | ----------------------------------- |
| `bun run dev`    | Start dev server                    |
| `bun run build`  | Build for production                |
| `bun run check`  | Type-check with svelte-check        |
| `bun run format` | Format code with Prettier           |
| `bun run lint`   | Check formatting & lint with ESLint |

**Best practice:** Run `bun run format` after writing code, and `bun run check` to catch type errors.
