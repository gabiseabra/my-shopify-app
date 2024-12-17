import { query } from "../utils/shopify-api";
import { gql } from "../utils/graphql-tag";
import { PageInfoFragment, ProductFragment } from "./fragments";
import { Product, ProductConnection } from "../types";

const Query = {
  async product(args: {
    id: string
  }): Promise<Product> {
    return (await query<{ product: Product }>(gql`
      query product($id: ID!) {
        product(id: $id) { ...ProductFragment }
      }
      ${ProductFragment}
    `, args)).product;
  },

  async products(args: {
    first?: number
    after?: string
    last?: number
    before?: string
    sortKey?: string
  }): Promise<ProductConnection> {
    return (await query<{ products: ProductConnection }>(gql`
      query products(
        $first: Int
        $after: String
        $last: Int
        $before: String
        $sortKey: ProductSortKeys = ID
      ) {
        products(
          first: $first
          after: $after
          last: $last
          before: $before
          sortKey: $sortKey
        ) {
          edges {
            cursor
            node { ...ProductFragment }
          }
          pageInfo { ...PageInfoFragment }
        }
      }
      ${ProductFragment}
      ${PageInfoFragment}
      `, args)).products;
  },
}

export default Query;
