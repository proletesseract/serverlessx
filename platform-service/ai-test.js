const { spawnSync } = require('child_process');
const fs = require('fs');

// Define the file path of the TypeScript file to generate documentation for
const filePath = './platform-service/controllers/access.controller.ts';

// Define the path where the generated documentation should be saved
const docsPath = './docs';

// Generate documentation using the typedoc package
const typedocCommand = `npx typedoc --out ${docsPath} --excludeExternals ${filePath}`;
spawnSync(typedocCommand, { shell: true });

// Read the generated documentation file and extract the comments
const docsFile = `${docsPath}/modules.html`;
const docsContent = fs.readFileSync(docsFile, 'utf8');
const commentsRegex = /<p class="tsd-comment-text">([\s\S]*?)<\/p>/g;
const comments = docsContent.match(commentsRegex);

// Write the comments to the TypeScript file
const fileContent = fs.readFileSync(filePath, 'utf8');
const newFileContent = fileContent.replace(/\/\*\*([\s\S]*?)\*\//g, () => {
  return `/**\n * ${comments.shift().replace(/(<([^>]+)>)/gi, '')}\n */`;
});
fs.writeFileSync(filePath, newFileContent);

// Commit the changes to GitHub using the git CLI
// Note: You will need to set up authentication and authorization for this step
const gitCommands = [
  'git add .',
  'git commit -m "Update code comments with Typedoc"',
  'git push origin test',
];
for (const command of gitCommands) {
  spawnSync(command, { shell: true });
}

// Open a pull request on GitHub
// Note: You will need to use the GitHub API to do this programmatically
