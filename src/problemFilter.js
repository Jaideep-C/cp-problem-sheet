// problemFilter.js
import { ProblemUtils } from "./problemUtils.js";

export class ProblemFilter {
  static filterProblemsByRating(
    problems,
    successfulSubmissions,
    problemRatingDistribution
  ) {
    const problemRatingMap = new Map();

    problems.forEach((problem) => {
      if (ProblemUtils.isSolved(problem, successfulSubmissions)) return;

      const rating = problem.rating;
      if (!problemRatingMap.has(rating)) {
        problemRatingMap.set(rating, new Set());
      }
      problemRatingMap.get(rating).add(problem);
    });

    const filteredProblems = [];
    for (const [rating, problems] of problemRatingMap) {
      const numberOfProblems = problemRatingDistribution[rating];
      if (!numberOfProblems) continue;

      const problemArray = Array.from(problems);
      problemArray.sort((a, b) => b.contestId - a.contestId);
      filteredProblems.push(...problemArray.slice(0, numberOfProblems));
    }

    return filteredProblems;
  }
}
