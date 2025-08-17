# Development Setup Guide

This guide helps you set up a development environment for contributing to Octopus AI IDE.

## Prerequisites

### System Requirements

- **Node.js**: 18.x or later (LTS recommended)
- **Python**: 3.8+ (for AI model integrations)
- **Git**: Latest version
- **Docker**: For running local services (optional)
- **VS Code**: Recommended IDE for development

### Operating System Support

- **macOS**: 10.15 (Catalina) or later
- **Windows**: 10 version 1903 or later, Windows 11
- **Linux**: Ubuntu 18.04+, Fedora 32+, or equivalent

## Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/octopus-ai/octopus-ide.git
   cd octopus-ide
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your AI API keys
   ```

4. **Start Development**
   ```bash
   npm run watch
   ```

5. **Launch in Debug Mode**
   ```bash
   npm run electron:dev
   ```

## Detailed Setup

### 1. Repository Setup

```bash
# Clone the repository
git clone https://github.com/octopus-ai/octopus-ide.git
cd octopus-ide

# Add upstream remote for syncing with main repository
git remote add upstream https://github.com/octopus-ai/octopus-ide.git

# Create a new branch for your feature
git checkout -b feature/your-feature-name
```

### 2. Node.js Dependencies

```bash
# Install all dependencies
npm install

# Install development tools globally (optional)
npm install -g electron-builder
npm install -g typescript
npm install -g eslint
```

### 3. Environment Configuration

Create and configure your environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# AI Model API Keys
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GOOGLE_AI_API_KEY=AIza-your-google-key

# Development Settings
NODE_ENV=development
LOG_LEVEL=debug
DEV_TOOLS=true

# Local Services
OLLAMA_ENDPOINT=http://localhost:11434
DATABASE_URL=sqlite:./data/dev.db

# Feature Flags
ENABLE_EXPERIMENTAL_FEATURES=true
ENABLE_AI_DEBUG_MODE=true
```

### 4. Database Setup

```bash
# Create development database
npm run db:setup

# Run migrations
npm run db:migrate

# Seed with test data (optional)
npm run db:seed
```

### 5. AI Models Setup

#### Cloud Models
Configure API keys in `.env` file (see above).

#### Local Models (Optional)
```bash
# Install Ollama for local AI models
curl -fsSL https://ollama.ai/install.sh | sh

# Download development models
ollama pull codellama:7b
ollama pull deepseek-coder:6.7b

# Verify installation
ollama list
```

## Build Scripts

### Development Scripts

```bash
# Start development with hot reload
npm run watch              # Equivalent to npm run watch-client and watch-extensions

# Start development with specific target
npm run watch-client       # Main and renderer processes
npm run watch-extensions   # Extensions only

# Alternative: Run both watchers
npm-run-all -p watch-client watch-extensions

# Compile TypeScript
npm run compile

# Run tests
npm test                  # All tests
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:e2e         # End-to-end tests

# Linting and formatting
npm run lint             # ESLint
npm run lint:fix         # Auto-fix linting issues
npm run format           # Prettier formatting
npm run typecheck        # TypeScript type checking
```

### Build Scripts

```bash
# Build for development
npm run build:dev

# Build for production
npm run build:prod

# Build specific components
npm run build:main
npm run build:renderer
npm run build:extensions

# Package for distribution
npm run package          # Current platform
npm run package:win      # Windows
npm run package:mac      # macOS
npm run package:linux    # Linux
```

## Development Workflow

### 1. Starting Development

```bash
# Terminal 1: Start file watcher
npm run watch

# Terminal 2: Start Electron in debug mode
npm run electron:dev

# Terminal 3: Run tests in watch mode (optional)
npm run test:watch
```

### 2. Project Structure

```
octopus/
├── src/                    # Source code
│   ├── main/              # Main Electron process
│   ├── renderer/          # Renderer process (UI)
│   ├── ai/                # AI integration layer
│   ├── extensions/        # Built-in extensions
│   └── shared/            # Shared utilities
├── test/                  # Test files
├── build/                 # Build scripts and configuration
├── docs/                  # Documentation
├── resources/             # Application resources
└── scripts/               # Development scripts
```

### 3. Code Organization

#### Main Process (`src/main/`)
- Application lifecycle management
- Window management
- Native OS integration
- Security and permissions

#### Renderer Process (`src/renderer/`)
- User interface components
- React/TypeScript application
- AI chat interface
- Code editor integration

#### AI Layer (`src/ai/`)
- Model adapters and managers
- Request orchestration
- Context management
- Error handling and fallbacks

#### Extensions (`src/extensions/`)
- Built-in extension modules
- Language support
- AI-powered features
- Third-party extension support

## Debugging

### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args": ["--remote-debugging-port=9223", "."],
      "outputCapture": "std",
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "name": "Debug Renderer Process",
      "type": "chrome",
      "request": "attach",
      "port": 9223,
      "webRoot": "${workspaceFolder}/src/renderer",
      "timeout": 30000
    }
  ]
}
```

### Debugging AI Features

```typescript
// Enable AI debug mode in development
const aiDebugMode = process.env.NODE_ENV === 'development';

if (aiDebugMode) {
  // Log all AI requests and responses
  aiClient.on('request', (request) => {
    console.log('AI Request:', request);
  });

  aiClient.on('response', (response) => {
    console.log('AI Response:', response);
  });
}
```

### Browser DevTools

- **Main Process**: Use `--inspect` flag or VS Code debugger
- **Renderer Process**: Press `Ctrl+Shift+I` or `Cmd+Option+I`
- **Extensions**: Use Extension Host Developer Tools

## Testing

### Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run specific test file
npm run test:unit -- src/ai/orchestrator.test.ts

# Run tests with coverage
npm run test:coverage
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration

# Test specific AI model integration
npm run test:integration -- --grep "OpenAI"
```

### End-to-End Tests

```bash
# Run E2E tests
npm run test:e2e

# Run specific E2E test
npm run test:e2e -- --spec "chat-interface"

# Run E2E tests in headless mode
npm run test:e2e:headless
```

### Test Configuration

#### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

#### AI Model Testing

```typescript
// Mock AI responses for testing
import { mockAIResponse } from '../test/helpers/ai-mocks';

describe('AI Code Generation', () => {
  beforeEach(() => {
    mockAIResponse({
      model: 'gpt-4-turbo',
      response: 'const testFunction = () => { return "test"; };'
    });
  });

  it('should generate code from prompt', async () => {
    const result = await aiOrchestrator.generateCode({
      prompt: 'Create a test function',
      language: 'typescript'
    });

    expect(result.code).toContain('testFunction');
  });
});
```

## Code Quality

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

## Performance Profiling

### Electron Performance

```bash
# Profile main process
npm run profile:main

# Profile renderer process
npm run profile:renderer

# Analyze bundle size
npm run analyze:bundle
```

### AI Performance Monitoring

```typescript
// Performance monitoring for AI operations
class AIPerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  measureAIRequest<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();

    return fn().finally(() => {
      const duration = performance.now() - start;
      this.recordMetric(operation, duration);
    });
  }

  getAverageResponseTime(operation: string): number {
    const times = this.metrics.get(operation) || [];
    return times.reduce((a, b) => a + b, 0) / times.length;
  }
}
```

## Troubleshooting

### Common Issues

#### Node Modules Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Issues
```bash
# Clear build cache
npm run clean
npm run rebuild
```

#### TypeScript Issues
```bash
# Restart TypeScript service in VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# Check TypeScript configuration
npm run typecheck
```

#### AI Model Connection Issues
```bash
# Test AI model connections
npm run test:ai-models

# Check API key configuration
npm run validate:api-keys
```

### Development Tools

#### Useful VS Code Extensions

- **TypeScript and JavaScript**: Built-in support
- **ESLint**: Real-time linting
- **Prettier**: Code formatting
- **Jest**: Test runner integration
- **GitLens**: Enhanced Git integration
- **Thunder Client**: API testing

#### Browser Extensions

- **React Developer Tools**: React component debugging
- **Redux DevTools**: State management debugging

## Contributing Guidelines

### Code Style

1. **TypeScript**: Use strict type checking
2. **React**: Use functional components with hooks
3. **Async/Await**: Prefer over Promises for readability
4. **Error Handling**: Always handle errors gracefully
5. **Comments**: Document complex AI logic thoroughly

### Commit Messages

Use conventional commit format:

```
feat(ai): add support for Claude 3 model
fix(chat): resolve message history persistence issue
docs(api): update AI generation endpoint documentation
test(integration): add tests for model switching
```

### Pull Request Process

1. **Create Feature Branch**: `git checkout -b feature/description`
2. **Write Tests**: Ensure good test coverage
3. **Update Documentation**: Keep docs in sync with changes
4. **Run Quality Checks**: `npm run lint && npm test`
5. **Submit PR**: Include description and testing instructions

This development setup guide ensures you have everything needed to contribute effectively to Octopus AI IDE development.
