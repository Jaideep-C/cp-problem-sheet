// config.js
import fs from "fs";
import CodeforcesAPI from "./src/codeforcesAPI.js";
import { VERDICT_OK } from "./src/constants.js";
import { ExcelExporter } from "./src/excelExporter.js";
import { HtmlExporter } from "./src/htmlExporter.js";
import { ProblemFilter } from "./src/problemFilter.js";
export const loadConfig = () => {
  const data = fs.readFileSync("./resources/config.json", "utf8");
  return JSON.parse(data);
};

// main.js
async function main() {
  const config = loadConfig();

  var problems = await CodeforcesAPI.getProblemsFromPastContestsByRating(
    config.numberOfContests,
    config.minProblemRating,
    config.maxProblemRating,
    config.validContests
  );
  if (config.includeTags.length > 0) {
    problems = problems.filter((problem) =>
      problem.tags.some((tag) => config.includeTags.includes(tag))
    );
  }
  if (config.excludeTags.length > 0) {
    problems = problems.filter(
      (problem) => !problem.tags.some((tag) => config.excludeTags.includes(tag))
    );
  }
  const allUserSubmissions = [
    ...(await CodeforcesAPI.getUsersSubmissions(config.handles)),
  ];
  console.log(typeof allUserSubmissions);
  const successfulSubmissions = allUserSubmissions.filter(
    (submission) => submission.verdict === VERDICT_OK
  );
  const otherSubmissions = allUserSubmissions.filter(
    (submission) => submission.verdict !== VERDICT_OK
  );

  const filteredProblems = ProblemFilter.filterProblemsByRating(
    problems,
    successfulSubmissions,
    config.problemRatingDistribution
  );

  await ExcelExporter.exportToExcel(
    filteredProblems,
    successfulSubmissions,
    otherSubmissions,
    "./out/problems.xlsx"
  );

  HtmlExporter.exportToHtml(
    filteredProblems,
    successfulSubmissions,
    otherSubmissions,
    config,
    "./out/problems.html"
  );
}

main().catch(console.error);
