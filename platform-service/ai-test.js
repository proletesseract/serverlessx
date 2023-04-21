const { spawnSync } = require('child_process');
const fs = require('fs');

// Define the file path of the TypeScript file to generate documentation for
const filePath = './platform-service/controllers/access.controller.ts';

// Define the path where the generated documentation should be saved
const docsPath = './docs';

// Read the file content
const fileContent = fs.readFileSync(filePath, 'utf8');

// Define a regular expression to match function declarations
const functionRegex = /(public|private|protected)?\s*(async)?\s*(static)?\s*([a-zA-Z_$][\w$]*)\s*\(([^\)]*)\)(\s*:\s*([^\s{}[\]]+))?(\s*{\s*)?/g;

// Extract function names and parameters
const functionDeclarations = [];
let match = functionRegex.exec(fileContent);
while (match) {
  const [fullMatch, accessModifier, isAsync, isStatic, name, parameters] = match;
  functionDeclarations.push({
    name,
    parameters,
  });
  match = functionRegex.exec(fileContent);
}

// Generate inlinecode comments for functions
const comments = functionDeclarations.map((declaration) => {
  const parameters = declaration.parameters.split(',').map((parameter) => parameter.trim());
  const parameterComments = parameters.map((parameter) => ` * @param ${parameter} - The ${parameter} parameter.\n`).join('');
  return `/**
 * @function ${declaration.name}
${parameterComments} */`;
});

// Write the comments to the TypeScript file
let newFileContent = fileContent;
for (let i = 0; i < functionDeclarations.length; i++) {
  const declaration = functionDeclarations[i];
  newFileContent = newFileContent.replace(declaration.name, `${comments[i]}\n${declaration.name}`);
}
fs.writeFileSync(filePath, newFileContent);

// Generate documentation using the typedoc package
const typedocCommand = `npx typedoc --out ${docsPath} --excludeExternals ${filePath}`;
spawnSync(typedocCommand, { shell: true });

// Commit the changes to GitHub using the git CLI
// Note: You will need to set up authentication and authorization for this step
const gitCommands = [
  'git add .',
  'git commit -m "Update inlinecode comments with Typedoc"',
  'git push origin test',
];
for (const command of gitCommands) {
  spawnSync(command, { shell: true });
}

// Open a pull request on GitHub
// Note: You will need to use the GitHub API to do this programmatically
