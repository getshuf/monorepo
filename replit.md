# Shuffle CLI Monorepo

## Overview

Shuffle is a filesystem-driven CLI tool built with TypeScript and Commander.js. The project provides a modular command system where commands are dynamically loaded from the filesystem, along with a metadata system for storing user preferences and displaying contextual information like tips.

The CLI is designed to be extensible through a plugin-like architecture where commands are organized in directories and automatically discovered at runtime.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### CLI Framework
- **Problem**: Need a structured way to build CLI commands with options, aliases, and help text
- **Solution**: Commander.js as the command framework with a custom dynamic loader
- **Approach**: Commands are TypeScript files in `src/bin/commands/` that export a `CommandDefinition` object. The loader discovers and registers them automatically at runtime.

### Command Loading System
- Commands live in `src/bin/commands/` organized by category folders
- Each command exports metadata (name, description, options, permissions) and an action function
- Supports lifecycle hooks: `before`, `after`, `validate`
- Permission checking built into the command context

### Metadata System
- **Problem**: Need persistent user preferences and dynamic CLI features (like tips)
- **Solution**: JSON-based store at `~/.shuffle.json` with a modular metadata registry
- **Components**:
  - `store.ts`: Read/write user preferences to disk
  - `registry.ts`: Discovers metadata modules from `dist/meta/` directories
  - `types.ts`: Defines the MetaDefinition interface
  - `parser.ts`: Converts CLI string inputs to typed JSON values

### Permission System
- Enum-based permissions (`Permission` enum in `src/types/permissions.ts`)
- `PermissionResolver` interface allows different auth backends
- Currently uses `LocalPermissionResolver` that permits everything (placeholder for real auth)

### Build System
- TypeScript compiled to ES modules (NodeNext)
- Source in `src/`, output in `dist/`
- Path aliases: `@/*` maps to `src/*`
- Executable entry point: `dist/bin/index.js` exposed as `shuffle` command

## External Dependencies

### Runtime Dependencies
- **commander**: CLI framework for parsing arguments and building commands
- **zod**: Schema validation library (available but usage not visible in provided files)
- **node-fetch**: HTTP client for making API requests
- **typescript**: TypeScript compiler

### Development Dependencies
- **tsx**: TypeScript execution for development (`npm run dev`)
- **@types/node**: Node.js type definitions

### File System
- User config stored at `~/.shuffle.json`
- Commands discovered from `dist/bin/commands/` directory
- Meta modules discovered from `dist/meta/` directory