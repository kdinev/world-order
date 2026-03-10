# WorldOrder

A strategy/geopolitics simulation game built with Angular. Manage nations, economies, and global policies in a dynamic world order simulation.

## Project Overview

WorldOrder is an interactive game where players manage country simulations across multiple domains:
- **Economy**: Trade, resources, and financial systems
- **Geopolitics**: International relations and conflicts
- **Population**: Demographics and social systems
- **Policies**: Government decisions and their impacts
- **Overview**: Comprehensive game state and statistics

Built with modern Angular 21+ using standalone components, signals, and server-side rendering for optimal performance and user experience.

## Project Structure

```
src/app/
├── components/
│   ├── dashboard/          # Main game interface
│   └── panels/             # Domain-specific panels
│       ├── economy-panel/
│       ├── geopolitics-panel/
│       ├── overview-panel/
│       ├── policies-panel/
│       └── population-panel/
├── services/
│   ├── game.service.ts     # Core game logic
│   └── turn-engine.service.ts  # Turn management
├── models/
│   └── game.model.ts       # Type definitions
├── guards/
│   └── game-active.guard.ts # Route protection
└── data/
    ├── events.data.ts      # Game events
    ├── player-presets.data.ts  # Preset configurations
    └── world-countries.data.ts # Country data
```

## Development

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

Install dependencies:
```bash
npm install
```

### Development Server

Start the local development server:
```bash
npm start
```

Navigate to `http://localhost:4200/`. The application automatically reloads when you modify source files.

### Code Generation

Generate new components with Angular CLI:
```bash
ng generate component component-name
```

For all available schematics:
```bash
ng generate --help
```

### Building

Build the project for production:
```bash
npm run build
```

Output is stored in the `dist/` directory with production optimizations enabled.

### Testing

Run unit tests with [Vitest](https://vitest.dev/):
```bash
npm run test
```

## Technology Stack

- **Framework**: [Angular 21+](https://angular.dev)
- **Language**: TypeScript
- **Styling**: SCSS
- **Testing**: Vitest
- **Build Tool**: Angular CLI
- **SSR**: Angular Universal
- **UI Components**: [Ignite UI for Angular](https://www.infragistics.com/products/ignite-ui-angular)

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [Ignite UI for Angular GitHub Repository](https://github.com/IgniteUI/igniteui-angular)
