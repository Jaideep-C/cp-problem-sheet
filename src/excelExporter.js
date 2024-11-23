// excelExporter.js
import ExcelJS from "exceljs";
import { ProblemUtils } from "./problemUtils.js";

export class ExcelExporter {
  static COLUMNS = [
    { header: "Contest ID", key: "contestId", width: 10 },
    { header: "Name", key: "name", width: 20 },
    { header: "Rating", key: "rating", width: 10 },
    { header: "Tags", key: "tags", width: 50 },
    { header: "Solved", key: "solved", width: 10 },
    { header: "url", key: "url", width: 50 },
  ];

  static CELL_STYLES = {
    SOLVED: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF00FF00" },
    },
    ATTEMPTED: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF0000" },
    },
  };

  static async exportToExcel(
    problems,
    successfulSubmissions,
    otherSubmissions,
    outputPath
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Problems");

    worksheet.columns = this.COLUMNS;

    problems.forEach((problem) => {
      const isSolved = ProblemUtils.isSolved(problem, successfulSubmissions);
      const isAttempted = ProblemUtils.isAttempted(problem, otherSubmissions);

      const row = worksheet.addRow({
        contestId: problem.contestId,
        name: problem.name,
        rating: problem.rating,
        tags: problem.tags,
        solved: isSolved ? "Yes" : "No",
        url: ProblemUtils.getProblemUrl(problem),
      });

      row.fill = isSolved
        ? this.CELL_STYLES.SOLVED
        : isAttempted
        ? this.CELL_STYLES.ATTEMPTED
        : null;
    });

    await workbook.xlsx.writeFile(outputPath);
  }
}
