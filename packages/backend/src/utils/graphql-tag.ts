/**
 * A template literal function for GraphQL queries.
 * This function behaves just like a regular template literal, joining the strings.
 * The purpose of this function is to activate syntax highlighting for GraphQL queries in VS Code.
 *
 * @param strings - Template strings
 * @param values - Template values
 * @returns The concatenated string
 */
export function gql(
  strings: TemplateStringsArray,
  ...values: string[]
): string {
  return strings.reduce((prev, curr, i) => prev + curr + (values[i] || ''), '')
}
