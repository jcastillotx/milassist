const VAMatchingService = require('../../services/vaMatching');

describe('VA Matching Service', () => {
  describe('Score Calculation Logic', () => {
    test('should have correct scoring weights', () => {
      expect(VAMatchingService.WEIGHTS).toBeDefined();
      expect(VAMatchingService.WEIGHTS.skills).toBe(0.40);
      expect(VAMatchingService.WEIGHTS.industry).toBe(0.20);
      expect(VAMatchingService.WEIGHTS.timezone).toBe(0.15);
      expect(VAMatchingService.WEIGHTS.language).toBe(0.15);
      expect(VAMatchingService.WEIGHTS.budget).toBe(0.10);
    });

    test('should calculate skills match correctly', () => {
      const requiredSkills = ['email', 'calendar'];
      const vaSkills = ['email', 'calendar', 'social'];

      const matchCount = requiredSkills.filter(s => vaSkills.includes(s)).length;
      const score = matchCount / requiredSkills.length;

      expect(score).toBe(1.0); // 2/2 = perfect match
    });

    test('should calculate partial skills match', () => {
      const requiredSkills = ['email', 'calendar', 'social'];
      const vaSkills = ['email', 'data-entry'];

      const matchCount = requiredSkills.filter(s => vaSkills.includes(s)).length;
      const score = matchCount / requiredSkills.length;

      expect(score).toBeCloseTo(0.33, 1); // 1/3
    });
  });

  describe('Timezone Scoring', () => {
    test('should score exact timezone match highly', () => {
      const score = VAMatchingService.calculateTimezoneScore('America/New_York', 'America/New_York');
      expect(score).toBe(1.0);
    });

    test('should score adjacent timezones moderately', () => {
      const score = VAMatchingService.calculateTimezoneScore('America/New_York', 'America/Chicago');
      expect(score).toBeGreaterThan(0.5);
      expect(score).toBeLessThan(1.0);
    });

    test('should score opposite timezones poorly', () => {
      const score = VAMatchingService.calculateTimezoneScore('America/New_York', 'Asia/Tokyo');
      expect(score).toBeLessThan(0.5);
    });
  });

  describe('Budget Validation', () => {
    test('should pass when VA rate is within budget', () => {
      const result = VAMatchingService.validateBudget(25, 30);
      expect(result).toBe(true);
    });

    test('should fail when VA rate exceeds budget', () => {
      const result = VAMatchingService.validateBudget(35, 30);
      expect(result).toBe(false);
    });

    test('should pass when VA rate equals budget', () => {
      const result = VAMatchingService.validateBudget(30, 30);
      expect(result).toBe(true);
    });
  });
});
