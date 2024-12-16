import { query } from "../utils/shopify-api"
import { gql } from "../utils/graphql-tag"
import { ProductFragment } from "./fragments"
import { Product, ProductInput } from "../types"

const Mutation = {
  async productCreate(input: { product: ProductInput }): Promise<Product> {
    return (await query<{ productCreate: { product: Product } }>(gql`
      mutation productCreate($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product { ...ProductFragment }
        }
      }
      ${ProductFragment}
    `, input)).productCreate.product
  },

  async productUpdate(input: { id: string, product: ProductInput }): Promise<Product> {
    return (await query<{ productUpdate: { product: Product } }>(gql`
      mutation productUpdate($product: ProductUpdateInput!) {
        productUpdate(product: $product) {
          product { ...ProductFragment }
        }
      }
      ${ProductFragment}
    `, {
        product: {
          id: input.id,
          ...input.product
        }
      })).productUpdate.product
  }
}

export default Mutation;
