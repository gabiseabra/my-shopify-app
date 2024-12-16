import type { Product, ProductCollection } from "shopify-admin-api/dist/types/interfaces";
import { query } from "../utils/shopify-api";
import { gql } from "../utils/graphql-tag";
import { PageInfoFragment, ProductFragment } from "./fragments";

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
  }): Promise<ProductCollection> {
    return (await query<{ products: ProductCollection }>(gql`
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
