# MilAssist Project Structure

## Repository Layout

```
milassist/
├── README.md                          # Project overview and quick start
├── .gitignore                         # Git ignore patterns
├── .editorconfig                       # Editor configuration
├── .env.example                        # Environment variables template
├── package.json                        # Root package.json (workspace management)
├── pnpm-workspace.yaml                 # PNPM workspace configuration
├── 
├── docs/                               # All documentation
│   ├── README.md                       # Documentation index
│   ├── PRD.md                          # Product Requirements Document
│   ├── ARCHITECTURE.md                 # System architecture
│   ├── API.md                          # API documentation
│   ├── SECURITY.md                     # Security policies
│   ├── TESTING.md                      # Testing strategy
│   ├── RUNBOOK.md                      # Operations guide
│   ├── BUILD_CHECKLIST.md              # Build and deployment checklist
│   ├── WORKFLOW.md                     # Development workflow
│   ├── AGENT_ROLES.md                  # AI agent definitions
│   ├── AGENT_HANDBOOK.md               # Multi-agent operating model
│   ├── ADR/                            # Architecture Decision Records
│   │   ├── 0001-initial-architecture.md
│   │   └── README.md
│   ├── api/                            # Detailed API documentation
│   │   ├── README.md
│   │   ├── auth.yaml
│   │   ├── travel.yaml
│   │   └── twilio.yaml
│   └── guides/                         # User guides
│       ├── deployment.md
│       ├── development.md
│       └── onboarding.md
│
├── .github/                            # GitHub configuration
│   ├── workflows/                      # CI/CD workflows
│   │   ├── ci.yml
│   │   ├── security.yml
│   │   └── deploy.yml
│   ├── ISSUE_TEMPLATE/                 # Issue templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── copilot-instructions.md         # GitHub Copilot rules
│
├── .cursor/                            # Cursor IDE configuration
│   └── rules.md                        # Cursor AI assistant rules
│
├── .windsurfrules                      # Windsurf AI assistant rules
│
├── CLAUDE.md                           # Claude AI assistant rules
│
├── CODEX.md                            # OpenAI Codex rules
│
├── AGENTS.md                           # Multi-agent governance
│
├── BLACKBOX.md                         # Blackbox testing rules
│
├── frontend/                           # React frontend application
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── public/
│   ├── src/
│   │   ├── components/                 # Reusable UI components
│   │   ├── pages/                      # Page components
│   │   ├── hooks/                      # Custom React hooks
│   │   ├── services/                   # API service layer
│   │   ├── store/                      # State management
│   │   ├── types/                      # TypeScript type definitions
│   │   ├── utils/                      # Utility functions
│   │   └── styles/                     # Global styles
│   └── tests/                          # Frontend tests
│
├── server/                             # Node.js backend API
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── src/
│   │   ├── controllers/                # Route controllers
│   │   ├── services/                   # Business logic services
│   │   ├── models/                     # Database models
│   │   ├── middleware/                 # Express middleware
│   │   ├── routes/                     # API route definitions
│   │   ├── utils/                      # Utility functions
│   │   ├── types/                      # TypeScript types
│   │   └── config/                     # Configuration files
│   ├── tests/                          # Backend tests
│   └── migrations/                     # Database migrations
│
├── shared/                             # Shared code between frontend/backend
│   ├── types/                          # Shared TypeScript types
│   ├── constants/                      # Shared constants
│   └── utils/                          # Shared utilities
│
├── infrastructure/                     # Infrastructure as code
│   ├── kubernetes/                     # K8s manifests (optional)
│   └── terraform/                      # Terraform configurations (optional)
│
└── scripts/                           # Development and deployment scripts
    ├── setup.sh                        # Initial setup script
    ├── dev.sh                          # Development environment
    ├── build.sh                        # Build script
    ├── test.sh                         # Test runner
    └── deploy.sh                       # Deployment script
```

## Key Principles

### 1. **Clear Boundaries**
- Frontend and backend are separate workspaces
- Shared code lives in `/shared` directory
- Infrastructure is isolated from application code

### 2. **Documentation First**
- All decisions documented in ADRs
- API contracts defined before implementation
- Agent rules enforced at IDE level

### 3. **Multi-Agent Safe**
- Each AI assistant has explicit rules
- No agent can bypass unanswered questions
- Architecture changes require ADRs

### 4. **Production Ready**
- Environment-based configuration
- Comprehensive testing setup
- CI/CD pipelines configured
- Security scanning enabled

### 5. **Developer Experience**
- Hot reloading in development
- Type safety across the stack
- Consistent code formatting
- Clear onboarding process

## Workspace Management

Using PNPM workspaces for monorepo management:

```yaml
# pnpm-workspace.yaml
packages:
  - 'frontend'
  - 'server'
  - 'shared'
```

This allows:
- Shared dependencies
- Cross-package scripts
- Type checking across boundaries
- Consistent version management
