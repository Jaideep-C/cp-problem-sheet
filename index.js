import CodeforcesAPI from "./src/codeforcesAPI.js";
import ExcelJS from "exceljs";
import fs from "fs";
let {
  handles,
  minProblemRating,
  maxProblemRating,
  numberOfContests,
  problemRatingDistribution,
} = (() => {
  const data = fs.readFileSync("config.json", "utf8");
  return JSON.parse(data);
})();
async function saveProblemsToExcel(
  problems,
  succesfulSubmissions,
  otherSubmissions
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Problems");
  worksheet.columns = [
    { header: "Contest ID", key: "contestId", width: 10 },
    { header: "Name", key: "name", width: 20 },
    { header: "Rating", key: "rating", width: 10 },
    { header: "Tags", key: "tags", width: 50 },
    { header: "Solved", key: "solved", width: 10 },
    { header: "url", key: "url", width: 50 },
  ];
  problems.forEach((problem) => {
    let isSolved = succesfulSubmissions.some(
      (submission) =>
        submission.problem.contestId == problem.contestId &&
        submission.problem.name == problem.name
    );
    let isAttempted = otherSubmissions.some(
      (submission) =>
        submission.problem.contestId == problem.contestId &&
        submission.problem.name == problem.name
    );
    const GREEEN_FILL = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF00FF00" },
    };
    const RED_FILL = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF0000" },
    };
    let row = worksheet.addRow({
      contestId: problem.contestId,
      name: problem.name,
      rating: problem.rating,
      tags: problem.tags,
      solved: isSolved ? "Yes" : "No",
      url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
    });

    row.fill = isSolved ? GREEEN_FILL : isAttempted ? RED_FILL : null;
  });
  await workbook.xlsx.writeFile("./out/problems.xlsx");
}
function getProblemUrl(problem) {
  const { contestId, index } = problem;
  return `https://codeforces.com/problemset/problem/${contestId}/${index}`;
}
function saveProblemsToHtml(problems, succesfulSubmissions, otherSubmissions) {
  let ratingFreqMap = new Map();
  problems.forEach((problem) => {
    let isSolved = succesfulSubmissions.some(
      (submission) =>
        submission.problem.contestId == problem.contestId &&
        submission.problem.name == problem.name
    );
    if (isSolved) return;
    let rating = problem.rating;
    if (ratingFreqMap.has(rating)) {
      ratingFreqMap.set(rating, ratingFreqMap.get(rating) + 1);
    } else {
      ratingFreqMap.set(rating, 1);
    }
  });
  let ratingFreqMapString = "";
  ratingFreqMap.forEach((value, key) => {
    ratingFreqMapString += `${key}: ${value}, `;
  });
  let tagsFrequencyMap = new Map();
  problems.forEach((problem) => {
    let tags = problem.tags;
    tags.forEach((tag) => {
      if (tagsFrequencyMap.has(tag)) {
        tagsFrequencyMap.set(tag, tagsFrequencyMap.get(tag) + 1);
      } else {
        tagsFrequencyMap.set(tag, 1);
      }
    });
  });
  console.log(tagsFrequencyMap);
  let html = `
  <!DOCTYPE html>
  <html>
  <head>
  <style>
    body {
        font-family: Arial, sans-serif;
    }
    .user-info {
        margin: 20px;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    .user-info h2 {
        color: #333;
    }
    .user-info p {
        color: #666;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    th {
      background-color: #4CAF50;
      color: white;
    }
    .tags {
      visibility: hidden;
    }
    td:hover .tags {
        visibility: visible;
    }
  </style>
  </head>
  <body>
  <div class="user-info">
    <h2>User Handle: ${handles}</h2>
    <p>Min Problem Rating: ${minProblemRating}</p>
    <p>Max Problem Rating: ${maxProblemRating}</p>
    <p>Number of Past contests: ${numberOfContests}</p>
    <p>Rating Freq ${ratingFreqMapString}</p>
  </div>
  <table>
    <tr>
      <th>Contest ID</th>
      <th>Name</th>
      <th>Rating</th>
      <th>Tags</th>
      <th>Solved</th>
    </tr>`;

  problems.forEach((problem) => {
    let isSolved = succesfulSubmissions.some(
      (submission) =>
        submission.problem.contestId == problem.contestId &&
        submission.problem.name == problem.name
    );
    let isAttempted = otherSubmissions.some(
      (submission) =>
        submission.problem.contestId == problem.contestId &&
        submission.problem.name == problem.name
    );
    // Add a row to the HTML table
    html += `<tr style="background-color: ${
      isSolved ? "#00FF00" : isAttempted ? "#FF0000" : "#FFFFFF"
    }">
    <td>${problem.contestId}</td>
    <td><a href="${getProblemUrl(problem)}">${problem.name}</a></td>
    <td>${problem.rating}</td>
    <td><div class="tags">${problem.tags}</div></td>
    <td>${isSolved ? "Yes" : "No"}</td>
  </tr>`;
  });

  html += "</table></body></html>";

  // Write the HTML content to a file
  fs.writeFileSync("./out/problems.html", html);
}
async function main() {
  const problems = await CodeforcesAPI.getProblemsFromPastContestsByRating(
    numberOfContests,
    minProblemRating,
    maxProblemRating
  );
  console.log(`Found ${problems.length} problems`);
  const allUserSubmissions = [
    ...(await CodeforcesAPI.getUsersSubmissions(handles)),
  ];
  const succesfulSubmissions = allUserSubmissions.filter(
    (submission) => submission.verdict == "OK"
  );
  const otherSubmissions = [];
  console.log(`${JSON.stringify(problems[0])}`);
  let problemRatingMap = new Map();
  problems.forEach((problem) => {
    let rating = problem.rating;
    if (
      succesfulSubmissions.some(
        (submission) =>
          submission.problem.contestId == problem.contestId &&
          submission.problem.name == problem.name
      )
    ) {
      return;
    }
    if (problemRatingMap.has(rating)) {
      let problemSet = problemRatingMap.get(rating);
      problemSet.add(problem);
      problemRatingMap.set(rating, problemSet);
    } else {
      problemRatingMap.set(rating, new Set([problem]));
    }
  });
  // console.log(problemRatingMap.get(1500));
  const filterdProblems = [];
  for (let [rating, problems] of problemRatingMap) {
    let numberOfProblems = problemRatingDistribution[rating];
    if (!numberOfProblems) continue;
    let problemArray = Array.from(problems);
    problemArray.sort((a, b) => b.contestId - a.contestId);
    filterdProblems.push(...problemArray.slice(0, numberOfProblems));
  }
  console.log(`Found ${filterdProblems.length} problems`);
  await saveProblemsToExcel(
    filterdProblems,
    succesfulSubmissions,
    otherSubmissions
  );
  saveProblemsToHtml(filterdProblems, succesfulSubmissions, otherSubmissions);
}
main();
