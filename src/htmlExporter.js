// htmlExporter.js
import { ProblemUtils } from "./problemUtils.js";
import fs from "fs";
export class HtmlExporter {
  static getStyles() {
    return `
        body { font-family: Arial, sans-serif; }
        .user-info {
          margin: 20px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .user-info h2 { color: #333; }
        .user-info p { color: #666; }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        tr:nth-child(even) { background-color: #f2f2f2; }
        th {
          background-color: #4CAF50;
          color: white;
        }
        .tags { visibility: hidden; }
        td:hover .tags { visibility: visible; }
      `;
  }

  static exportToHtml(
    problems,
    successfulSubmissions,
    otherSubmissions,
    config,
    outputPath
  ) {
    const ratingFreqMap = ProblemUtils.calculateRatingFrequency(
      problems,
      successfulSubmissions
    );
    const ratingFreqMapString = Array.from(ratingFreqMap.entries())
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>${this.getStyles()}</style>
        </head>
        <body>
          ${this.generateUserInfo(config, ratingFreqMapString)}
          ${this.generateTable(
            problems,
            successfulSubmissions,
            otherSubmissions
          )}
        </body>
        </html>
      `;

    fs.writeFileSync(outputPath, html);
  }

  static generateUserInfo(config, ratingFreqMapString) {
    return `
        <div class="user-info">
          <h2>User Handle: ${config.handles}</h2>
          <p>Min Problem Rating: ${config.minProblemRating}</p>
          <p>Max Problem Rating: ${config.maxProblemRating}</p>
          <p>Number of Past contests: ${config.numberOfContests}</p>
          <p>Rating Freq ${ratingFreqMapString}</p>
        </div>
      `;
  }

  static generateTable(problems, successfulSubmissions, otherSubmissions) {
    const tableHeader = `
        <table>
          <tr>
            <th>Contest ID</th>
            <th>Name</th>
            <th>Rating</th>
            <th>Tags</th>
            <th>Solved</th>
          </tr>
      `;

    const tableRows = problems
      .map((problem) => {
        const isSolved = ProblemUtils.isSolved(problem, successfulSubmissions);
        const isAttempted = ProblemUtils.isAttempted(problem, otherSubmissions);
        const backgroundColor = isSolved
          ? "#00FF00"
          : isAttempted
          ? "#FF0000"
          : "#FFFFFF";

        return `
          <tr style="background-color: ${backgroundColor}">
            <td>${problem.contestId}</td>
            <td><a href="${ProblemUtils.getProblemUrl(problem)}">${
          problem.name
        }</a></td>
            <td>${problem.rating}</td>
            <td><div class="tags">${problem.tags}</div></td>
            <td>${isSolved ? "Yes" : "No"}</td>
          </tr>
        `;
      })
      .join("");

    return `${tableHeader}${tableRows}</table>`;
  }
}
