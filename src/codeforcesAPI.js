// codeforcesAPI.js
import axios from "axios";

export default class CodeforcesAPI {
  static API_URL = "https://codeforces.com/api";
  static FINISHED_PHASE = "FINISHED";
  static async getAllContests() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await axios.get(`${this.API_URL}/contest.list`);
      return response.data.result;
    } catch (error) {
      console.error(error);
    }
  }
  static async getAllPastContests(numberOfContests, validContests) {
    // wait for 1 second before making the request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const contests = await this.getAllContests();
    return contests
      .filter((contest) => contest.phase == this.FINISHED_PHASE)
      .filter((contest) =>
        validContests.some((validName) => contest.name.includes(validName))
      )
      .sort((a, b) => b.id - a.id)
      .slice(0, Math.min(numberOfContests, contests.length));
  }
  static async getUsersSubmissions(handles) {
    const submissions = new Set();
    for (const handle of handles) {
      const userSubmissions = await this.getUserSubmissions(handle);
      userSubmissions.forEach((submission) => submissions.add(submission));
    }
    return submissions;
  }
  static async getUserSubmissions(handle) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await axios.get(
        `${this.API_URL}/user.status?handle=${handle}`
      );
      if (response.status != 200) return [];
      return response.data.result;
    } catch (error) {
      console.error(error);
    }
  }

  static async getAllProblems() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
    maxRating,
    validContests
  ) {
    const contests = await this.getAllPastContests(
      numberOfContests,
      validContests
    );
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
