# Testing Guide

## Overview

MilAssist uses Jest for backend testing with comprehensive test coverage for critical services and API endpoints.

## Quick Start

```bash
# Install dependencies
cd server && npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm test -- --coverage
```

## Test Structure

```
server/tests/
├── setup.js                    # Test environment configuration
├── services/
│   ├── rbac.test.js           # RBAC permission tests
│   └── vaMatching.test.js     # VA matching algorithm tests
└── routes/
    └── auth.test.js           # Authentication endpoint tests
```

## Writing Tests

### Service Tests

```javascript
const myService = require('../../services/myService');

describe('My Service', () => {
  test('should perform expected behavior', () => {
    const result = myService.doSomething();
    expect(result).toBe(expected);
  });
});
```

### API Route Tests

```javascript
const request = require('supertest');
const app = require('../../server');

describe('POST /api/endpoint', () => {
  test('should return 200 on success', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send({ data: 'test' });

    expect(response.status).toBe(200);
  });
});
```

## Test Configuration

### Environment Variables

Tests use `.env.test` with safe mock values:
- Test database (milassist_test)
- Mock API keys
- Test JWT secrets

### Coverage Thresholds

Minimum coverage requirements:
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

## Running Specific Tests

```bash
# Run tests for specific file
npm test -- rbac.test.js

# Run tests matching pattern
npm test -- --testNamePattern="hasPermission"

# Run tests with verbose output
npm test -- --verbose
```

## CI/CD Integration

Tests run automatically on:
- Every push to main/develop
- All pull requests
- Pre-deployment checks

GitHub Actions workflow: `.github/workflows/ci-cd.yml`

## Troubleshooting

### Database Connection Errors

Ensure PostgreSQL is running:
```bash
docker-compose up -d database
```

### Mock Data Issues

Clear test database:
```bash
npx sequelize-cli db:migrate:undo:all --env test
npx sequelize-cli db:migrate --env test
```

## Best Practices

1. **Test isolation**: Each test should be independent
2. **Mock external services**: Use Jest mocks for APIs, databases
3. **Clear test names**: Describe what is being tested
4. **Arrange-Act-Assert**: Follow AAA pattern
5. **Coverage goals**: Aim for 80%+ on critical paths

## Adding New Tests

1. Create test file in appropriate directory
2. Import service/route to test
3. Write descriptive test cases
4. Run tests to verify
5. Check coverage report

```bash
npm test -- --coverage
open coverage/lcov-report/index.html
```
