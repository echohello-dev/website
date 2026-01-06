import { describe, it, expect, beforeEach } from "vitest";
import { hardcodedProjects, getProjects, projects } from "../lib/data";

describe("Data Layer", () => {
  describe("hardcodedProjects", () => {
    it("should have at least 6 projects", () => {
      expect(hardcodedProjects.length).toBeGreaterThanOrEqual(6);
    });

    it("should have all required fields for each project", () => {
      hardcodedProjects.forEach((project) => {
        expect(project).toHaveProperty("title");
        expect(project).toHaveProperty("description");
        expect(typeof project.title).toBe("string");
        expect(typeof project.description).toBe("string");
        expect(project.title.length).toBeGreaterThan(0);
        expect(project.description.length).toBeGreaterThan(0);
      });
    });

    it("should have valid GitHub or website URLs", () => {
      hardcodedProjects.forEach((project) => {
        const hasUrl =
          (project.githubUrl && project.githubUrl.length > 0) ||
          (project.websiteUrl && project.websiteUrl.length > 0);
        expect(hasUrl).toBe(true);
      });
    });

    it("should have valid dates", () => {
      hardcodedProjects.forEach((project) => {
        if (project.createdAt) {
          expect(project.createdAt).toBeInstanceOf(Date);
          expect(project.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
        }
        if (project.lastActivity) {
          expect(project.lastActivity).toBeInstanceOf(Date);
        }
      });
    });

    it("Website project should have complete data", () => {
      const websiteProject = hardcodedProjects.find(
        (p) => p.title === "Website"
      );
      expect(websiteProject).toBeDefined();
      expect(websiteProject?.commitActivity).toBeDefined();
      expect(websiteProject?.commitActivity?.length).toBeGreaterThan(0);
      expect(websiteProject?.totalCommits).toBeGreaterThan(0);
      expect(websiteProject?.contributors).toBeGreaterThan(0);
      expect(websiteProject?.tags).toContain("Next.js");
    });

    it("should not have negative values for numeric fields", () => {
      hardcodedProjects.forEach((project) => {
        expect(project.stars || 0).toBeGreaterThanOrEqual(0);
        expect(project.ageInDays || 0).toBeGreaterThanOrEqual(0);
        expect(project.totalCommits || 0).toBeGreaterThanOrEqual(0);
        expect(project.contributors || 0).toBeGreaterThanOrEqual(0);
      });
    });

    it("should have correct ageInDays calculation", () => {
      hardcodedProjects.forEach((project) => {
        if (project.createdAt && project.ageInDays) {
          const expectedAgeInDays = Math.floor(
            (Date.now() - project.createdAt.getTime()) / (1000 * 60 * 60 * 24)
          );
          // Allow 1 day difference due to test timing
          expect(
            Math.abs(project.ageInDays - expectedAgeInDays)
          ).toBeLessThanOrEqual(1);
        }
      });
    });
  });

  describe("getProjects()", () => {
    beforeEach(() => {
      // Save original env
      delete process.env.USE_GITHUB_DATA;
    });

    it("should return at least 6 projects in development", async () => {
      const result = await getProjects();
      expect(result.length).toBeGreaterThanOrEqual(6);
    });

    it("should return valid Project objects", async () => {
      const result = await getProjects();
      result.forEach((project) => {
        expect(project).toHaveProperty("title");
        expect(project).toHaveProperty("description");
        expect(typeof project.title).toBe("string");
        expect(typeof project.description).toBe("string");
      });
    });
  });

  describe("projects constant", () => {
    it("should be equal to hardcodedProjects", () => {
      expect(projects).toEqual(hardcodedProjects);
    });
  });

  describe("Activity calculation", () => {
    it("projects should have consistent activity data", () => {
      hardcodedProjects.forEach((project) => {
        if (project.lastActivity && project.contributionActivityLevel) {
          const daysAgo = Math.floor(
            (Date.now() - project.lastActivity.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          // Verify activity level matches days ago
          if (daysAgo <= 7) {
            expect(["Very Active", "Active"]).toContain(
              project.contributionActivityLevel
            );
          }
        }
      });
    });
  });
});
