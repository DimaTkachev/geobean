import * as fs from "node:fs";
import * as path from "node:path";

import { parse } from "@typescript-eslint/parser";
import type { TSESTree } from "@typescript-eslint/types";

const BACKEND_INTERFACES_PATH = "../backend/src/models/interfaces.ts";
const FRONTEND_DTOS_PATH = "../frontend/src/types/dtos.ts";

interface InterfaceInfo {
  name: string;
  properties: Array<{
    name: string;
    type: string;
    optional: boolean;
  }>;
}

const extractInterfaces = (ast: TSESTree.Program): InterfaceInfo[] => {
  const interfaces: InterfaceInfo[] = [];

  const visit = (node: TSESTree.Node): void => {
    if (node.type === "TSInterfaceDeclaration") {
      const interfaceName = node.id.name;
      if (interfaceName.startsWith("I") && !interfaceName.includes("Model")) {
        const properties = node.body.body
          .map((prop: TSESTree.TypeElement) => {
            if (prop.type === "TSPropertySignature") {
              const { name } = prop.key as TSESTree.Identifier;
              const typeNode = prop.typeAnnotation?.typeAnnotation;
              let type = "";

              if (typeNode) {
                if (typeNode.type === "TSUnionType") {
                  type = typeNode.types
                    .map((t: TSESTree.TypeNode) => {
                      if (t.type === "TSLiteralType") {
                        return `'${
                          (t.literal as TSESTree.StringLiteral).value
                        }'`;
                      }
                      if (t.type === "TSNumberKeyword") return "number";
                      if (t.type === "TSStringKeyword") return "string";
                      if (t.type === "TSBooleanKeyword") return "boolean";
                      if (t.type === "TSNullKeyword") return "null";
                      if (t.type === "TSTypeReference") {
                        const typeName = (t.typeName as TSESTree.Identifier)
                          .name;
                        return typeName === "Date" ? "string" : typeName;
                      }
                      return "unknown";
                    })
                    .join(" | ");
                } else if (typeNode.type === "TSNumberKeyword") {
                  type = "number";
                } else if (typeNode.type === "TSStringKeyword") {
                  type = "string";
                } else if (typeNode.type === "TSBooleanKeyword") {
                  type = "boolean";
                } else if (typeNode.type === "TSNullKeyword") {
                  type = "null";
                } else if (typeNode.type === "TSTypeReference") {
                  type =
                    (typeNode.typeName as TSESTree.Identifier).name === "Date"
                      ? "string"
                      : (typeNode.typeName as TSESTree.Identifier).name;
                }
              }

              return {
                name,
                type: type || "unknown",
                optional: !!prop.optional,
              };
            }
            return null;
          })
          .filter((prop): prop is NonNullable<typeof prop> => prop !== null);

        interfaces.push({
          name: `${interfaceName.substring(1)}DTO`,
          properties,
        });
      }
    }

    for (const key in node) {
      const child = node[key as keyof typeof node];
      if (child && typeof child === "object") {
        visit(child as TSESTree.Node);
      }
    }
  };

  visit(ast);
  return interfaces;
};

const generateDTOContent = (interfaces: InterfaceInfo[]): string =>
  interfaces
    .map((int) => {
      const properties = int.properties
        .map((prop) => {
          const optional = prop.optional ? "?" : "";
          // Convert backend types to DTO types
          const type = prop.type
            .replace(/^I([A-Z])/g, "$1DTO") // Convert IType to TypeDTO
            .replace("Date", "string");
          return `    ${prop.name}${optional}: ${type};`;
        })
        .join("\n");

      return `export interface ${int.name} {\n${properties}\n}`;
    })
    .join("\n\n");

const main = async (): Promise<void> => {
  try {
    // Read backend interfaces file
    const interfacesContent = fs.readFileSync(
      path.resolve(process.cwd(), BACKEND_INTERFACES_PATH),
      "utf-8",
    );

    // Parse TypeScript code
    const ast = parse(interfacesContent, {
      sourceType: "module",
      ecmaVersion: 2020,
      ecmaFeatures: {
        jsx: true,
      },
    });

    // Extract interfaces
    const interfaces = extractInterfaces(ast);

    // Generate DTO content
    const dtoContent = generateDTOContent(interfaces);

    // Write to frontend DTOs file
    fs.writeFileSync(
      path.resolve(process.cwd(), FRONTEND_DTOS_PATH),
      dtoContent,
      "utf-8",
    );

    console.log("✅ DTOs generated successfully!");
  } catch (error) {
    console.error("Error generating DTOs:", error);
    process.exit(1);
  }
};

main();
