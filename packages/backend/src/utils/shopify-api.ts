const SHOPIFY_API_URL = process.env.SHOPIFY_API_URL;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

export async function query<T extends object>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`${SHOPIFY_API_URL}/admin/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
  }

  return data.data
}
