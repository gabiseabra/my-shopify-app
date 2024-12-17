import * as API from "../types";
import * as Shopify from "../utils/shopify-api";
import { gql } from "../utils/graphql-tag";

const Query = {
  async product(args: {
    handle: string
  }): Promise<API.Product> {
    const data = (await Shopify.query<{ productByHandle: Shopify.Product }>(gql`
      query product($handle: String!) {
        productByHandle(handle: $handle) { ...ProductFragment }
      }
      ${Shopify.ProductFragment}
    `, args)).productByHandle;

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

    return Shopify.mapConnection(data, Shopify.mkProduct);
  },
}

export default Query;
