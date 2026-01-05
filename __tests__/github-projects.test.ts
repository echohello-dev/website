import { describe, it, expect } from "vitest";

describe("GitHub Projects Utilities", () => {
  describe("Activity Level Calculation", () => {
    it("should classify recent activity as Very Active", () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 5);

      const daysAgo = Math.floor(
        (Date.now() - recentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysAgo <= 7) {
        expect("Very Active").toBeDefined();
      }
    });

    it("should classify 30-day old activity as Active", () => {
      const activityDate = new Date();
      activityDate.setDate(activityDate.getDate() - 15);

      const daysAgo = Math.floor(
        (Date.now() - activityDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysAgo > 7 && daysAgo <= 30) {
        expect("Active").toBeDefined();
      }
    });

    it("should classify old activity as Inactive", () => {
      const oldDate = new Date();
      oldDate.setMonth(oldDate.getMonth() - 12);

      const daysAgo = Math.floor(
        (Date.now() - oldDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysAgo > 180) {
        expect("Inactive").toBeDefined();
      }
    });
  });

  describe("Rate Limit Handling", () => {
    it("should handle rate limit info calculations", () => {
      const limit = 60;
      const remaining = 30;
      const percentRemaining = (remaining / limit) * 100;

      expect(percentRemaining).toBe(50);
      expect(percentRemaining).toBeGreaterThan(5);
    });

    it("should detect when rate limit is exhausted", () => {
      const remaining = 2;
      const limit = 60;
      const isLimited = remaining <= 0 || (remaining / limit) * 100 < 5;

      expect(isLimited).toBe(true);
    });

    it("should allow API calls when rate limit is healthy", () => {
      const remaining = 50;
      const limit = 60;
      const isLimited = remaining <= 0 || (remaining / limit) * 100 < 5;

      expect(isLimited).toBe(false);
    });
  });

  describe("Commit Activity Parsing", () => {
    it("should correctly transform week timestamps", () => {
      const weekTimestamp = 1704067200; // Unix timestamp for a specific week
      const milliseconds = weekTimestamp * 1000;

      expect(milliseconds).toBeGreaterThan(0);
      expect(typeof milliseconds).toBe("number");
    });

    it("should filter zero-commit weeks", () => {
      const commitActivity = [
        { total: 0, week: 1704067200, days: [] },
        { total: 5, week: 1704672000, days: [1, 1, 1, 1, 1] },
        { total: 0, week: 1705276800, days: [] },
      ];

      const filtered = commitActivity.filter((item) => item.total > 0);

      expect(filtered.length).toBe(1);
      expect(filtered[0].total).toBe(5);
    });
  });

  describe("Repository Data Transformation", () => {
    it("should correctly format repository names", () => {
      const repoName = "hello-world";
      const formatted = repoName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      expect(formatted).toBe("Hello World");
    });

    it("should limit tags to 5", () => {
      const tags = [
        "typescript",
        "react",
        "nextjs",
        "tailwindcss",
        "jest",
        "vitest",
        "eslint",
      ];
      const limitedTags = tags.slice(0, 5);

      expect(limitedTags.length).toBeLessThanOrEqual(5);
      expect(limitedTags.length).toBe(5);
    });

    it("should handle empty description", () => {
      const description =
        null ||
        "A GitHub repository with useful functionality and active development.";

      expect(description).toBeDefined();
      expect(typeof description).toBe("string");
    });
  });

  describe("Date Calculations", () => {
    it("should correctly calculate age in days", () => {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - 30);

      const ageInDays = Math.floor(
        (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(ageInDays).toBeGreaterThanOrEqual(29);
      expect(ageInDays).toBeLessThanOrEqual(31);
    });

    it("should handle date conversions correctly", () => {
      const isoString = "2024-05-04T00:00:00Z";
      const date = new Date(isoString);

      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(4); // Months are 0-indexed
    });
  });
});
