import { BASE_URL } from "./constants.js";
// problemUtils.js
export class ProblemUtils {
  static getProblemUrl(problem) {
    const { contestId, index } = problem;
    return `${BASE_URL}/${contestId}/${index}`;
  }

  static isSolved(problem, submissions) {
    return submissions.some(
      (submission) =>
        submission.problem.contestId === problem.contestId &&
        submission.problem.name === problem.name
    );
  }

  static isAttempted(problem, submissions) {
    return submissions.some(
      (submission) =>
        submission.problem.contestId === problem.contestId &&
        submission.problem.name === problem.name
    );
  }

  static calculateRatingFrequency(problems, successfulSubmissions) {
    const ratingFreqMap = new Map();

    problems.forEach((problem) => {
      if (this.isSolved(problem, successfulSubmissions)) return;

      const rating = problem.rating;
      ratingFreqMap.set(rating, (ratingFreqMap.get(rating) || 0) + 1);
    });

    return ratingFreqMap;
  }

  static calculateTagsFrequency(problems) {
    const tagsFrequencyMap = new Map();

    problems.forEach((problem) => {
      problem.tags.forEach((tag) => {
        tagsFrequencyMap.set(tag, (tagsFrequencyMap.get(tag) || 0) + 1);
      });
    });

    return tagsFrequencyMap;
  }
}
