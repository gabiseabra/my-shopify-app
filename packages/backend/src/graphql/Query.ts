import * as API from "../types";
import * as Shopify from "../utils/shopify-api";
import { gql } from "../utils/graphql-tag";

const Query = {
  async product(args: {
    handle: string
  }): Promise<API.Product> {
    const data = (await Shopify.query<{ product: Shopify.Product }>(gql`
      query product($id: ID!) {
        product(id: $id) { ...ProductFragment }
      }
      ${Shopify.ProductFragment}
    `, args)).product;
    return Shopify.mkProduct(data);
  },

  async products(args: {
    first?: number
    after?: string
    last?: number
    before?: string
    sortKey?: string
  }): Promise<API.ProductConnection> {
    const data = (await Shopify.query<{ products: Shopify.Connection<Shopify.Product> }>(gql`
      query products($first: Int, $after: String, $last: Int, $before: String, $sortKey: ProductSortKeys) {
        products(first: $first, after: $after, last: $last, before: $before, sortKey: $sortKey) {
          edges {
            cursor
            node { ...ProductFragment }
          }
          nodes { ...ProductFragment }
          pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        }
      }
      ${Shopify.ProductFragment}
    `, args)).products;
    return {
      edges: data.edges.map(({ cursor, node }) => ({
        cursor,
        node: Shopify.mkProduct(node),
      })),
      nodes: data.nodes.map(Shopify.mkProduct),
      pageInfo: data.pageInfo,
    };
  },
}

export default Query;
