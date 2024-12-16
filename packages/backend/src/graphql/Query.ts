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
    after?: string
    sortKey?: string
  }): Promise<ProductConnection> {
    return (await query<{ products: ProductConnection }>(gql`
      query products(
        $after: String
        $sortKey: ProductSortKeys = ID
      ) {
        products(
          first: 5
          after: $after
          sortKey: $sortKey
        ) {
          edges {
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
