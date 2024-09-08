import "module-alias/register";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

const aliases = isProduction
  ? {
      "@b": path.resolve(process.cwd(), "dist/backend"),
      "@db": path.resolve(process.cwd(), "dist/models"),
    }
  : {
      "@b": path.resolve(process.cwd(), "backend"),
      "@db": path.resolve(process.cwd(), "models"),
    };

for (const alias in aliases) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("module-alias").addAlias(alias, aliases[alias]);
}
