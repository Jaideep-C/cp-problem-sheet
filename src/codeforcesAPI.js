// codeforcesAPI.js
import axios from "axios";

export default class CodeforcesAPI {
  static API_URL = "https://codeforces.com/api";
  static FINISHED_PHASE = "FINISHED";
  static async getAllContests() {
    try {
      const response = await axios.get(`${this.API_URL}/contest.list`);
      return response.data.result;
    } catch (error) {
      console.error(error);
    }
  }
  static async getAllPastContests(numberOfContests) {
    const contests = await this.getAllContests();
    return contests
      .filter((contest) => contest.phase == this.FINISHED_PHASE)
      .sort((a, b) => b.id - a.id)
      .slice(0, Math.min(numberOfContests, contests.length));
  }
  static async getUserSubmissions(handle) {
    try {
      const response = await axios.get(
        `${this.API_URL}/user.status?handle=${handle}`
      );
      return response.data.result;
    } catch (error) {
      console.error(error);
    }
  }

  static async getAllProblems() {
    try {
      const response = await axios.get(`${this.API_URL}/problemset.problems`);
      return response.data.result.problems;
    } catch (error) {
      console.error(error);
    }
  }
  static async getProblemsForContests(contests) {
    const contestIds = contests.map((contest) => contest.id);

    return await this.getAllProblems().then((allProblems) => {
      const problems = [];
      allProblems.forEach((problem) => {
        if (contestIds.includes(problem.contestId)) {
          problems.push(problem);
        }
      });
      return problems;
    });
  }
  static async getProblemsFromPastContestsByRating(
    numberOfContests,
    minRating,
    maxRating
  ) {
    const contests = await this.getAllPastContests(numberOfContests);
    const problems = await this.getProblemsForContests(contests);
    if (minRating > maxRating)
      throw new Error("minRating must be less than maxRating");
    return problems
      .filter(
        (problem) => problem.rating >= minRating && problem.rating <= maxRating
      )
      .sort((a, b) => a.rating - b.rating);
  }
}
