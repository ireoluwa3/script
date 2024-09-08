const fs = require("fs");
const path = require("path");
const ts = require("typescript");
require("dotenv").config();

const {
  extractStrings,
  containsTranslatableContent,
  handleImportDeclaration,
  handleJsxAttribute,
  handleJsxText,
  formatContent,
  addImportStatement,
} = require("./utils");

const {
  saveStringsToFile,
  supportedLocales,
  azureError,
} = require("./translate");

const subscriptionKey = process.env.AZURE_SUBSCRIPTION_KEY;
const translate = process.argv.includes("--translate");

if (!subscriptionKey && translate) {
  azureError();
  process.exit(1);
}

const directoryPath = path.join(process.cwd(), "src");

const removeDuplicateUseTranslation = (lines) => {
  let found = false;
  return lines.filter((line) => {
    if (line.includes("const { t } = useTranslation();")) {
      if (!found) {
        found = true;
        return true;
      }
      return false;
    }
    return true;
  });
};

const handleFunctionTranslation = (node, sourceFile) => {
  let fileUpdated = false;

  if (
    (ts.isFunctionDeclaration(node) ||
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node)) &&
    node.body &&
    ts.isBlock(node.body)
  ) {
    const functionText = node.getText(sourceFile);
    const containsTFunction = functionText.includes("t(");
    const containsUseTranslation = functionText.includes("useTranslation");
    const containsJSXElement = functionText.includes("return (");

    if (containsTFunction && !containsUseTranslation && containsJSXElement) {
      const useTranslationStatement = ts.factory.createVariableStatement(
        undefined,
        ts.factory.createVariableDeclarationList(
          [
            ts.factory.createVariableDeclaration(
              ts.factory.createObjectBindingPattern([
                ts.factory.createBindingElement(
                  undefined,
                  undefined,
                  "t",
                  undefined
                ),
              ]),
              undefined,
              undefined,
              ts.factory.createCallExpression(
                ts.factory.createIdentifier("useTranslation"),
                undefined,
                []
              )
            ),
          ],
          ts.NodeFlags.Const
        )
      );

      node.body.statements = ts.factory.createNodeArray([
        useTranslationStatement,
        ...node.body.statements,
      ]);

      fileUpdated = true;
    }
  }

  return { node, fileUpdated };
};

const addUseTranslationToFunction = (lines, functionName, fileUpdated) => {
  let functionStarted = false;
  let functionEnded = false;
  let functionBody = [];
  let functionLines = [];
  let functionFound = false;
  let functionIndex = 0;
  let containsTFunction = false;
  let containsJSXElement = false;

  lines.forEach((line, index) => {
    if (
      line.includes(`function ${functionName}`) ||
      line.includes(`${functionName} =`)
    ) {
      functionFound = true;
      functionIndex = index;
    }

    if (functionFound) {
      if (line.includes("{")) {
        functionStarted = true;
      }

      if (functionStarted && !functionEnded) {
        functionBody.push(line);
        if (line.includes("t(")) {
          containsTFunction = true;
        }
        if (line.includes("return (")) {
          containsJSXElement = true;
        }
      }

      if (line.includes("}")) {
        functionEnded = true;
      }
    }
  });

  if (functionBody.length > 0 && containsTFunction && containsJSXElement) {
    functionBody.forEach((line) => {
      functionLines.push(line);
    });

    if (
      !functionLines.some((line) =>
        line.includes("const { t } = useTranslation();")
      )
    ) {
      const functionDeclaration = functionLines[0];
      const functionBody = functionLines.slice(1, functionLines.length - 1);
      const functionEnd = functionLines[functionLines.length - 1];

      const newFunctionBody = [
        "const { t } = useTranslation();",
        ...functionBody,
      ];

      const newFunction = [
        functionDeclaration,
        ...newFunctionBody,
        functionEnd,
      ];

      lines.splice(functionIndex, functionLines.length, ...newFunction);
      fileUpdated = true;
    }
  }

  return { lines, fileUpdated };
};

const processFile = (filePath, allStrings) => {
  const relativeFilePath = path.relative(__dirname, filePath);
  const logPath = relativeFilePath.startsWith("src")
    ? relativeFilePath
    : filePath;

  const fileContent = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  const strings = extractStrings(sourceFile);
  strings.forEach((str) => allStrings.add(str));

  if (!containsTranslatableContent(sourceFile)) {
    return;
  }

  let importAdded = false;
  let fileUpdated = false;

  try {
    const transformer = (context) => {
      const visit = (node) => {
        let result;
        ({ node, importAdded } = handleImportDeclaration(node, importAdded));
        result = handleFunctionTranslation(node, sourceFile);
        node = result.node;
        fileUpdated = fileUpdated || result.fileUpdated;

        result = handleJsxAttribute(node, fileUpdated);
        node = result.node;
        fileUpdated = fileUpdated || result.fileUpdated;

        result = handleJsxText(node, fileUpdated);
        node = result.node;
        fileUpdated = fileUpdated || result.fileUpdated;

        return ts.visitEachChild(node, visit, context);
      };
      return (node) => ts.visitNode(node, visit);
    };

    const result = ts.transform(sourceFile, [transformer]);
    const printer = ts.createPrinter();
    let newContent = printer.printFile(result.transformed[0]);

    let lines = newContent.split("\n");
    const initialContent = lines.join("\n");
    const initialFileUpdated = fileUpdated;
    ({ lines, fileUpdated } = addImportStatement(
      lines,
      importAdded,
      fileUpdated
    ));

    const functionMatches = initialContent.match(
      /(?:function|const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(\s*\)\s*=>\s*{/
    );
    if (functionMatches) {
      const functionName = functionMatches[1];
      ({ lines, fileUpdated } = addUseTranslationToFunction(
        lines,
        functionName,
        fileUpdated
      ));
    } else {
      const namedFunctionMatches = initialContent.match(
        /function\s+(\w+)\s*\(/
      );
      if (namedFunctionMatches) {
        const functionName = namedFunctionMatches[1];
        ({ lines, fileUpdated } = addUseTranslationToFunction(
          lines,
          functionName,
          fileUpdated
        ));
      }
    }

    const finalContent = lines.join("\n");
    newContent = removeDuplicateUseTranslation(finalContent.split("\n")).join(
      "\n"
    );
    newContent = formatContent(newContent, filePath);

    if (
      fileUpdated ||
      initialFileUpdated ||
      fileContent.trim() !== newContent.trim()
    ) {
      if (fileContent.trim() !== newContent.trim()) {
        fs.writeFileSync(filePath, newContent, "utf8");
        console.log(`Updated and formatted file: ${logPath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing file: ${logPath}`, error);
    throw error;
  }
};

const traverseDirectory = async (dir, allStrings = new Set()) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip the /src/components/builder/themes directory
      if (filePath.includes('builder')) {
  continue;
}

      await traverseDirectory(filePath, allStrings);
    } else if (stat.isFile() && filePath.endsWith(".tsx")) {
      processFile(filePath, allStrings);
    }
  }

  return allStrings;
};

(async () => {
  console.log(`Starting traversal...`);
  const allStrings = await traverseDirectory(directoryPath);

  const outputDir = path.join(process.cwd(), "public", "locales");
  await saveStringsToFile(allStrings, outputDir, supportedLocales, translate);

  console.log(`Traversal complete.`);
})();
