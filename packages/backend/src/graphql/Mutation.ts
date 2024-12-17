import * as API from "../types";
import * as Shopify from "../utils/shopify-api";
import { gql } from "../utils/graphql-tag"

const Mutation = {
  async productCreate(input: { product: API.ProductInput }): Promise<API.Product> {
    // Create the product.
    // @note The product is created with a single variant.
    const product = (await Shopify.query<{ productCreate: { product: Shopify.Product } }>(gql`
      mutation productCreate($product: ProductInput!) {
        productCreate(input: $product) {
          product { ...ProductFragment }
        }
      }
      ${Shopify.ProductFragment}
    `, {
      product: {
        title: input.product.title,
        status: input.product.status,
      }
    })).productCreate.product;
    const variant = product.variants?.edges[0]?.node;

    if (!variant) throw new Error(`Failed to create product variant`);

    // Update the product variant
    if (input.product.sku) {
      (await Shopify.query(gql`
        mutation productVariantUpdate($variant: ProductVariantInput!) {
          productVariantUpdate(input: $variant) {
            productVariant { id, sku }
          }
        }
      `, {
        variant: {
          id: variant.id,
          inventoryItem: { sku: input.product.sku },
        }
      }));
    }

    return {
      ...Shopify.mkProduct(product),
      sku: input.product.sku ?? '',
    }
  },

  async productUpdate(input: { id: string, product: API.ProductInput }): Promise<API.Product> {
    // Get data for the product
    const product = (await Shopify.query<{ product: Shopify.Product }>(gql`
      query product($id: ID!) {
        product(id: $id) { ...ProductFragment }
      }
      ${Shopify.ProductFragment}
    `, { id: input.id })).product;
    const variant = product.variants?.edges[0]?.node;

    if (!product || !variant) throw new Error(`Product not found: ${input.id}`);

    // Update the product
    const result = (await Shopify.query<{ productUpdate: { product: Shopify.Product } }>(gql`
      mutation productUpdate($product: ProductInput!, $variant: ProductVariantInput!) {
        productVariantUpdate(input: $variant) {
          productVariant { id }
        }
        productUpdate(input: $product) {
          product { ...ProductFragment }
        }
      }
      ${Shopify.ProductFragment}
    `, {
        product: {
          id: product.id,
          title: input.product.title,
          status: input.product.status,
        },
        variant: {
          id: variant.id,
          inventoryItem: { sku: input.product.sku }
        },
      })).productUpdate.product

      return Shopify.mkProduct(result);
  }
}

export default Mutation;
