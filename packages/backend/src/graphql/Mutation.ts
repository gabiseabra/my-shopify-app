import * as API from "../types";
import * as Shopify from "../utils/shopify-api";
import { gql } from "../utils/graphql-tag"

const Mutation = {
  async productCreate(input: { product: API.ProductInput }): Promise<API.Product> {
    const data = (await Shopify.query<{ productCreate: { product: Shopify.Product } }>(gql`
      mutation productCreate($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product { ...ProductFragment }
        }
      }
      ${Shopify.ProductFragment}
    `, input)).productCreate.product
    return Shopify.mkProduct(data);
  },

  async productUpdate(input: { id: string, product: API.ProductInput }): Promise<API.Product> {
    return (await Shopify.query<{ productUpdate: { product: Shopify.Product } }>(gql`
      mutation productUpdate($product: ProductUpdateInput!) {
        productUpdate(product: $product) {
          product { ...ProductFragment }
        }
      }
      ${Shopify.ProductFragment}
    `, {
        product: {
          id: input.id,
          ...input.product
        }
      })).productUpdate.product
  }
}

export default Mutation;
