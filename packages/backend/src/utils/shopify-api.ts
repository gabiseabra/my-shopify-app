import { gql } from "./graphql-tag";
import type * as API from "../types";

const SHOPIFY_API_URL = process.env.SHOPIFY_API_URL;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

/**
 * Run a GraphQL query against the Shopify Admin API.
 * @param {string} query     The GraphQL query to run.
 * @param {object} variables The variables to pass to the query.
 */
export async function query<T extends object>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`${SHOPIFY_API_URL}/admin/api/2024-07/graphql.json`, {
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

/** Below are the types and fragments for the Shopify Admin API, and
 * some helper functions to convert these types to the public API types. */

export type Connection<T> = {
  edges: {
    cursor: string
    node: T
  }[]
  nodes: T[]
  pageInfo: PageInfo
}

export const mapConnection = <A, B>(data: Connection<A>, fn: (a: A) => B): Connection<B> => ({
  edges: data.edges.map(({ cursor, node }) => ({ cursor, node: fn(node) })),
  nodes: data.nodes.map(fn),
  pageInfo: data.pageInfo,
});

export type PageInfo = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string
  endCursor: string
}

export const PageInfoFragment = gql`
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

export type Media = {
  alt: string;
  preview: {
    image: {
      id: string;
      url: string;
      width: number;
      height: number;
    }
  }
}

export const MediaFragment = gql`
  fragment MediaFragment on Media {
    alt
    preview {
      image {
        id
        url
        width
        height
      }
    }
  }
`;

export const mkImage = (data: Media): API.Image => ({
  id: data.preview?.image.id,
  alt: data.alt,
  url: data.preview?.image.url,
  width: data.preview?.image.width,
  height: data.preview?.image.height,
});

export type Product = {
  id: string
  status: API.ProductStatus
  title: string
  handle: string
  defaultCursor: string
  featuredMedia: Media
  variants: Connection<{
    id: string
    sku: string
  }>
}

export const ProductFragment = gql`
  fragment ProductFragment on Product {
    id
    status
    title
    handle
    defaultCursor
    descriptionHtml
    featuredMedia { ...MediaFragment }
    variants(first: 1) {
      edges {
        node {
          id
          sku
        }
      }
    }
  }
  ${MediaFragment}
`;

export const mkProduct = (data: Product): API.Product => ({
  id: data.id,
  status: data.status,
  title: data.title,
  handle: data.handle,
  defaultCursor: data.defaultCursor,
  sku: data.variants.edges[0]?.node.sku,
  image: data.featuredMedia && mkImage(data.featuredMedia),
});
