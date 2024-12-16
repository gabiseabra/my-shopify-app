import type { ProductCollection } from "shopify-admin-api/dist/types/interfaces";
import { query } from "../utils/shopify-api";
import { gql } from "../utils/graphql-tag";

type ProductsInput = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

const Query = {
  async products(args: ProductsInput): Promise<ProductCollection> {
    return (await query<{ products: ProductCollection }>(gql`
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
            node {
              defaultCursor
              descriptionHtml
              featuredMedia {
                alt
                id
                status
                mediaContentType
                preview {
                  image {
                    id
                    url
                    width
                    height
                  }
                  status
                }
              }
              handle
              id
              seo { title, description }
              status
              title
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
      `, args)).products;
  },
}

export default Query;
