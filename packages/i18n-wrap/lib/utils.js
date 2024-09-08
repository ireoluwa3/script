const ts = require("typescript");
const prettier = require("prettier");

const shouldTranslateAttribute = (name) => {
  const translateAttributes = [
    "content",
    "label",
    "placeholder",
    "title",
    "modelName",
    "cardName",
    "tableName",
    "postTitle",
  ];
  return translateAttributes.includes(name);
};

const shouldSkipContent = (text) => {
  const skipPatterns = [
    /^[0-9]+$/, // Numbers only
    /^[\s:;,!?()\[\]{}#%$&*+\-=/\\’@$.\.\.\:\-\/\^_`\|~·]+$/, // Special characters only
    /^[-+]?(\d+(\.\d+)?%?)$/, // Numbers including decimals and percentages
    /^\d{1,2}:\d{2} (AM|PM)$/i, // Time strings
    /^\s*$/, // Empty or whitespace-only strings
    /^[A-Za-z]$/, // Single letters
    /^F\d{1,2}$/, // Function keys
    /^\w+\.webp$/, // File names ending in .webp
    /^\w+\.\w{2,4}$/, // General file names with extensions
    /^[A-Za-z]\d$/, // Single letter followed by a digit
    /^[\d,]+%?$/, // Numbers with commas and optional percentage sign
    /^[\d,]+ \w+$/, // Numbers with commas and units

    // Colors
    /^#([0-9A-Fa-f]{6})$/, // Hex colors
    /^rgba?\(\d{1,3},\d{1,3},\d{1,3}(,\d{1,3})?\)$/, // RGB and RGBA colors
    /^hsla?\(\d{1,3},\d{1,3}%,\d{1,3}%(,\d{1,3})?\)$/, // HSL and HSLA colors

    // HTML escape sequences
    /^&(?:bull|mdash|middot|times);$/, // HTML escape sequences for special characters

    // Numbers followed by a period
    /^\d+\.$/, // Numbers followed by a period

    // skip any start with /img
    /^\/img/,
  ];
  return skipPatterns.some((pattern) => pattern.test(text));
};

const shouldSkipExactMatch = (text) => {
  const skipExactMatch = [
    "width=device-width, initial-scale=1",
    "index,follow,max-image-preview:large",
    "image/png",
  ];
  return skipExactMatch.includes(text);
};

const cleanText = (text) => {
  // Remove leading/trailing special characters but preserve inner content
  text = text
    .replace(
      /^[\s:;,!?()\[\]{}#%$&*+\-=/\\]+|[\s:;,!?()\[\]{}#%$&*+\-=/\\]+$/g,
      ""
    )
    .trim();
  // Remove \r\n and excessive whitespace
  return text
    .replace(/\r?\n|\r/g, " ")
    .replace(/\s\s+/g, " ")
    .trim();
};

const extractTranslatableParts = (text) => {
  const cleanedText = cleanText(text);
  if (
    cleanedText &&
    !shouldSkipContent(cleanedText) &&
    !shouldSkipExactMatch(cleanedText)
  ) {
    return [cleanedText];
  }
  return [];
};

const extractStrings = (sourceFile) => {
  const strings = new Set();

  const visit = (node) => {
    const addStringIfValid = (text) => {
      const parts = extractTranslatableParts(text);
      parts.forEach((part) => strings.add(part));
    };

    if (ts.isJsxAttribute(node) && shouldTranslateAttribute(node.name.text)) {
      if (node.initializer && ts.isStringLiteral(node.initializer)) {
        addStringIfValid(node.initializer.text);
      }
    } else if (ts.isJsxText(node)) {
      addStringIfValid(node.getText());
    } else if (
      ts.isCallExpression(node) &&
      node.expression.getText() === "t" &&
      node.arguments.length > 0 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      addStringIfValid(node.arguments[0].text);
    }

    ts.forEachChild(node, visit);
  };

  ts.forEachChild(sourceFile, visit);
  return Array.from(strings);
};

const containsTranslatableContent = (sourceFile) => {
  return extractStrings(sourceFile).length > 0;
};

const handleJsxAttribute = (node, fileUpdated) => {
  if (ts.isJsxAttribute(node) && shouldTranslateAttribute(node.name.text)) {
    if (
      node.initializer &&
      ts.isStringLiteral(node.initializer) &&
      node.initializer.text.trim() &&
      !shouldSkipContent(node.initializer.text.trim()) &&
      !shouldSkipExactMatch(node.initializer.text.trim())
    ) {
      const text = cleanText(node.initializer.text);
      const parts = extractTranslatableParts(text);
      if (parts.length === 1) {
        node = ts.factory.updateJsxAttribute(
          node,
          node.name,
          ts.factory.createJsxExpression(
            undefined,
            ts.factory.createCallExpression(
              ts.factory.createIdentifier("t"),
              undefined,
              [ts.factory.createStringLiteral(parts[0])]
            )
          )
        );
        fileUpdated = true;
      }
    }
  }
  return { node, fileUpdated };
};

const handleJsxText = (node, fileUpdated) => {
  if (ts.isJsxText(node)) {
    const text = cleanText(node.getText().trim());
    const parts = extractTranslatableParts(text);
    if (parts.length === 1) {
      node = ts.factory.createJsxExpression(
        undefined,
        ts.factory.createCallExpression(
          ts.factory.createIdentifier("t"),
          undefined,
          [ts.factory.createStringLiteral(parts[0])]
        )
      );
      fileUpdated = true;
    }
  }
  return { node, fileUpdated };
};

const handleImportDeclaration = (node, importAdded) => {
  if (
    ts.isImportDeclaration(node) &&
    node.moduleSpecifier.text === "next-i18next"
  ) {
    const namedImports = node.importClause.namedBindings;
    if (ts.isNamedImports(namedImports)) {
      const elements = namedImports.elements;
      if (elements.some((el) => el.name.text === "useTranslation")) {
        importAdded = true;
      }
    }
  }
  return { node, importAdded };
};

const addImportStatement = (lines, importAdded, fileUpdated) => {
  if (!importAdded) {
    const importStatement = `import { useTranslation } from 'next-i18next';\n`;
    // Find the last import statement
    const lastImportIndex = lines.reduce((lastIndex, line, index) => {
      return /^import\s.+/.test(line) ? index : lastIndex;
    }, -1);

    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, importStatement);
    } else {
      lines.unshift(importStatement);
    }
    return { lines, fileUpdated: true };
  }
  return { lines, fileUpdated };
};

const formatContent = (content, filePath) => {
  const rules = {
    singleQuote: false,
    semi: true,
    trailingComma: "es5",
    arrowParens: "always",
    bracketSpacing: true,
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    proseWrap: "always",
    htmlWhitespaceSensitivity: "css",
    insertPragma: false,
    requirePragma: false,
    endOfLine: "lf",
    embeddedLanguageFormatting: "auto",
  };

  return prettier.format(content, {
    ...rules,
    parser: "typescript",
    filepath: filePath,
  });
};

module.exports = {
  extractStrings,
  containsTranslatableContent,
  handleJsxAttribute,
  handleJsxText,
  handleImportDeclaration,
  addImportStatement,
  formatContent,
};
