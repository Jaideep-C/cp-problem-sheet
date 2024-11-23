# Codeforces Practice Sheet Generator

This project helps Codeforces users create customized practice sheets tailored to their specific needs. By configuring the `config.json` file, users can fetch unattempted problems from the Codeforces API within a specified rating range and tags, and generate practice sheets in both HTML and Excel formats.

## Features

- **Fetch Problems:** Retrieve problems from the Codeforces API based on user preferences.
- **Advanced Filtering:** Filter problems by rating, tags, and contest types.
- **Multi-Format Outputs:** Generate practice sheets in HTML and Excel formats.
- **Focused Practice:** Enable systematic preparation to improve Codeforces ratings.

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Jaideep-C/codeforces-practice-sheet-generator.git
   cd codeforces-practice-sheet-generator
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Configuration

1. Copy the example configuration file:

   ```sh
   cp resources/config.example.json resources/config.json
   ```

2. Edit the `resources/config.json` file to define your preferences:

   ```json
   {
     "handles": ["your_handle"],
     "minProblemRating": 1300,
     "maxProblemRating": 1400,
     "numberOfContests": 100,
     "problemRatingDistribution": {
       "1300": 5,
       "1400": 5
     },
     "validContests": ["Div. 2", "Div. 3"],
     "includeTags": ["bitmasks"],
     "excludeTags": []
   }
   ```

   - **handles:** List of your Codeforces handles.
   - **minProblemRating / maxProblemRating:** Specify the rating range for problems.
   - **numberOfContests:** Limit the number of contests to fetch problems from.
   - **problemRatingDistribution:** Define how many problems to fetch for each rating.
   - **validContests:** Filter problems by contest types (e.g., "Div. 2").
   - **includeTags / excludeTags:** Include or exclude specific problem tags.

### Usage

Run the project using the command:

```sh
npm start
```

The generated practice sheets will be saved in the `out` directory.

## Project Structure

```
.DS_Store
.eslintrc.json
.gitignore
index.js
package.json
resources/
  config.example.json
  config.json
src/
  codeforcesAPI.js
  constants.js
  excelExporter.js
  htmlExporter.js
  problemFilter.js
  problemUtils.js
```

- **`index.js`**: Entry point of the application.
- **`resources/config.json`**: Configuration file for user preferences.
- **`src/codeforcesAPI.js`**: Functions for interacting with the Codeforces API.
- **`src/constants.js`**: Contains constant values used throughout the project.
- **`src/excelExporter.js`**: Exports problems to an Excel file.
- **`src/htmlExporter.js`**: Exports problems to an HTML file.
- **`src/problemFilter.js`**: Filters problems based on user configurations.
- **`src/problemUtils.js`**: Utility functions for problem handling.

## Contributing

Contributions are welcome! Open an issue or submit a pull request to suggest improvements or report bugs.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgements

- [Codeforces](https://codeforces.com/) for providing the API to fetch problems and contests.
