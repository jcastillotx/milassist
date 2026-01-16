# Production Quality Guidelines

This directory contains production quality documentation adapted from the [vibe-skeleton-app](https://github.com/jcastillotx/vibe-skeleton-app) repository to ensure milassist meets production standards.

## Documents

| Document | Purpose |
|----------|---------|
| [DEVELOPMENT_ORCHESTRATION.md](./DEVELOPMENT_ORCHESTRATION.md) | Complete 10-phase lifecycle with quality gates |
| [PROGRESSIVE_GUARDRAILS.md](./PROGRESSIVE_GUARDRAILS.md) | Scope control and change management system |
| [WORKFLOW.md](./WORKFLOW.md) | Day-to-day development workflow |
| [AGENT_HANDBOOK.md](./AGENT_HANDBOOK.md) | AI-assisted development standards |
| [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) | Production deployment checklist |
| [VERSIONING.md](./VERSIONING.md) | Semantic versioning standards |

## Key Quality Gates

Before production deployment, ensure:

- [ ] **Testing**: >80% test coverage, all tests passing
- [ ] **Security**: No critical/high vulnerabilities
- [ ] **Code Review**: All feedback addressed
- [ ] **Staging**: Verified in staging environment
- [ ] **Monitoring**: Production oversight infrastructure in place

## Quick Reference

### Current Development Phase

Use the guardrails system to identify your current phase and what decisions are locked vs. flexible.

### Production Readiness Checklist

1. All features implemented per acceptance criteria
2. Test coverage meets threshold (>80%)
3. Security audit complete
4. Code review approved
5. Staging deployment verified
6. Monitoring and alerting configured
7. Documentation updated
