import { buildSchema } from "graphql";
import { gql } from "../utils/graphql-tag";

export default buildSchema(gql`
type Query {
  """Returns a Product resource by ID."""
  product(
    """The ID of the Product to return."""
    id: ID!
  ): Product

  """Returns a list of products."""
  products(
    """
    The elements that come after the specified [cursor](https://shopify.dev/api/usage/pagination-graphql).
    """
    after: String

    """
    Sort the underlying list using a key. If your query is slow or returns an
    error, then [try specifying a sort key that matches the field used in the search](https://shopify.dev/api/usage/pagination-graphql#search-performance-considerations).
    """
    sortKey: ProductSortKeys = ID
  ): ProductConnection!

  """Count of products. Limited to a maximum of 10000."""
  productsCount(
    """The upper bound on count value before returning a result."""
    limit: Int
  ): Count
}

type Mutation {
  """
  Creates a product.
  
  Learn more about the [product model](https://shopify.dev/docs/apps/build/graphql/migrate/new-product-model)
  and [adding product data](https://shopify.dev/docs/apps/build/graphql/migrate/new-product-model/add-data).
  """
  productCreate(
    """The properties of the new product."""
    product: ProductInput
  ): Product

  """
  Updates a product.
  
  For versions \`2024-01\` and older:
  If you update a product and only include some variants in the update,
  then any variants not included will be deleted.
  
  To safely manage variants without the risk of
  deleting excluded variants, use
  [productVariantsBulkUpdate](https://shopify.dev/api/admin-graphql/latest/mutations/productvariantsbulkupdate).
  
  If you want to update a single variant, then use
  [productVariantUpdate](https://shopify.dev/api/admin-graphql/latest/mutations/productvariantupdate).
  """
  productUpdate(
    id: ID!
    """The updated properties for a product."""
    product: ProductInput
  ): Product
}

"""
The \`Product\` object lets you manage products in a merchant’s store.

Products are the goods and services that merchants offer to customers. They can
include various details such as title, description, price, images, and options
such as size or color.
You can use [product variants](https://shopify.dev/docs/api/admin-graphql/latest/objects/productvariant)
to create or update different versions of the same product.
You can also add or update product [media](https://shopify.dev/docs/api/admin-graphql/latest/interfaces/media).
Products can be organized by grouping them into a [collection](https://shopify.dev/docs/api/admin-graphql/latest/objects/collection).

Learn more about working with [Shopify's product model](https://shopify.dev/docs/apps/build/graphql/migrate/new-product-model/product-model-components),
including limitations and considerations.
"""
type Product {
  """
  A default [cursor](https://shopify.dev/api/usage/pagination-graphql) that
  returns the single next record, sorted ascending by ID.
  """
  defaultCursor: String!

  """
  The description of the product, with
  HTML tags. For example, the description might include
  bold \`<strong></strong>\` and italic \`<i></i>\` text.
  """
  descriptionHtml: HTML!

  """
  The featured [media](https://shopify.dev/docs/apps/build/online-store/product-media)
  associated with the product.
  """
  featuredMedia: Media

  """
  A unique, human-readable string of the product's title. A handle can contain
  letters, hyphens (\`-\`), and numbers, but no spaces.
  The handle is used in the online store URL for the product.
  """
  handle: String!

  """A globally-unique ID."""
  id: ID!

  """
  The [SEO title and description](https://help.shopify.com/manual/promoting-marketing/seo/adding-keywords)
  that are associated with a product.
  """
  seo: SEO!

  """
  The [product status](https://help.shopify.com/manual/products/details/product-details-page#product-status),
  which controls visibility across all sales channels.
  """
  status: ProductStatus!

  """
  The name for the product that displays to customers. The title is used to construct the product's handle.
  For example, if a product is titled "Black Sunglasses", then the handle is \`black-sunglasses\`.
  """
  title: String!
}

"""An auto-generated type for paginating through multiple Products."""
type ProductConnection {
  """
  The connection between the node and its parent. Each edge contains a minimum of the edge's cursor and the node.
  """
  edges: [ProductEdge!]!

  """
  A list of nodes that are contained in ProductEdge. You can fetch data about an
  individual node, or you can follow the edges to fetch data about a collection
  of related nodes. At each node, you specify the fields that you want to retrieve.
  """
  nodes: [Product!]!

  """
  An object that’s used to retrieve [cursor
  information](https://shopify.dev/api/usage/pagination-graphql) about the current page.
  """
  pageInfo: PageInfo!
}

"""
An auto-generated type which holds one Product and a cursor during pagination.
"""
type ProductEdge {
  """
  The position of each node in an array, used in [pagination](https://shopify.dev/api/usage/pagination-graphql).
  """
  cursor: String!

  """The item at the end of ProductEdge."""
  node: Product!
}

input ProductInput {
  """
  The description of the product, with HTML tags.
  For example, the description might include bold \`<strong></strong>\` and italic \`<i></i>\` text.
  """
  descriptionHtml: String

  """
  A unique, human-readable string of the product's title. A handle can contain
  letters, hyphens (\`-\`), and numbers, but no spaces.
  The handle is used in the online store URL for the product.
  For example, if a product is titled "Black Sunglasses", then the handle is \`black-sunglasses\`.
  """
  handle: String

  """
  The [SEO title and description](https://help.shopify.com/manual/promoting-marketing/seo/adding-keywords)
  that are associated with a product.
  """
  seo: SEOInput

  """
  The [product status](https://help.shopify.com/manual/products/details/product-details-page#product-status),
  which controls visibility across all sales channels.
  """
  status: ProductStatus

  """
  The name for the product that displays to customers. The title is used to construct the product's handle.
  For example, if a product is titled "Black Sunglasses", then the handle is \`black-sunglasses\`.
  """
  title: String
}

"""The possible product statuses."""
enum ProductStatus {
  """
  The product is ready to sell and can be published to sales channels and apps.
  Products with an active status aren't automatically published to sales
  channels, such as the online store, or apps. By default, existing products are set to active.
  """
  ACTIVE

  """
  The product is no longer being sold and isn't available to customers on sales channels and apps.
  """
  ARCHIVED

  """
  The product isn't ready to sell and is unavailable to customers on sales
  channels and apps. By default, duplicated and unarchived products are set to draft.
  """
  DRAFT
}

enum ProductSortKeys {
  """Sort by the \`created_at\` value."""
  CREATED_AT

  """Sort by the \`id\` value."""
  ID

  """Sort by the \`inventory_total\` value."""
  INVENTORY_TOTAL

  """Sort by the \`product_type\` value."""
  PRODUCT_TYPE

  """Sort by the \`published_at\` value."""
  PUBLISHED_AT

  """
  Sort by relevance to the search terms when the \`query\` parameter is specified on the connection.
  Don't use this sort key when no search query is specified.
  [Pagination](https://shopify.dev/api/usage/pagination-graphql) isn't supported when using this sort key.
  """
  RELEVANCE

  """Sort by the \`title\` value."""
  TITLE

  """Sort by the \`updated_at\` value."""
  UPDATED_AT

  """Sort by the \`vendor\` value."""
  VENDOR
}

"""SEO information."""
type SEO {
  """SEO Description."""
  description: String

  """SEO Title."""
  title: String
}

"""The input fields for SEO information."""
input SEOInput {
  """SEO title of the product."""
  title: String

  """SEO description of the product."""
  description: String
}

"""Represents an image resource."""
type Image {
  """A unique ID for the image."""
  id: ID

  """
  The location of the image as a URL.
  """
  url: URL!

  """
  The original width of the image in pixels. Returns \`null\` if the image isn't hosted by Shopify.
  """
  width: Int

  """
  The original height of the image in pixels. Returns \`null\` if the image isn't hosted by Shopify.
  """
  height: Int
}

"""Represents a media interface."""
type Media {
  """A word or phrase to share the nature or contents of a media."""
  alt: String

  """A globally-unique ID."""
  id: ID!

  """The media content type."""
  mediaContentType: MediaContentType!

  """Current status of the media."""
  status: MediaStatus!

  """The preview image for the media."""
  preview: MediaPreviewImage
}

"""Represents the preview image for a media."""
type MediaPreviewImage {
  """
  The preview image for the media. Returns \`null\` until \`status\` is \`READY\`.
  """
  image: Image

  """Current status of the preview image."""
  status: MediaPreviewImageStatus!
}

"""The possible content types for a media object."""
enum MediaContentType {
  """A Shopify-hosted video."""
  VIDEO

  """An externally hosted video."""
  EXTERNAL_VIDEO

  """A 3d model."""
  MODEL_3D

  """A Shopify-hosted image."""
  IMAGE
}

"""The possible statuses for a media preview image."""
enum MediaPreviewImageStatus {
  """Preview image is uploaded but not yet processed."""
  UPLOADED

  """Preview image is being processed."""
  PROCESSING

  """Preview image is ready to be displayed."""
  READY

  """Preview image processing has failed."""
  FAILED
}

"""The possible statuses for a media object."""
enum MediaStatus {
  """Media has been uploaded but not yet processed."""
  UPLOADED

  """Media is being processed."""
  PROCESSING

  """Media is ready to be displayed."""
  READY

  """Media processing has failed."""
  FAILED
}

type Count {
  """The count of elements."""
  count: Int!

  """The count's precision, or the exactness of the value."""
  precision: CountPrecision!
}

"""The precision of the value returned by a count field."""
enum CountPrecision {
  """The count is exactly the value."""
  EXACT

  """The count is at least the value. A limit was imposed and reached."""
  AT_LEAST
}

"""
Returns information about pagination in a connection, in accordance with the
[Relay specification](https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo).
For more information, please read our [GraphQL Pagination Usage Guide](https://shopify.dev/api/usage/pagination-graphql).
"""
type PageInfo {
  """The cursor corresponding to the last node in edges."""
  endCursor: String

  """Whether there are more pages to fetch following the current page."""
  hasNextPage: Boolean!

  """Whether there are any pages prior to the current page."""
  hasPreviousPage: Boolean!

  """The cursor corresponding to the first node in edges."""
  startCursor: String
}

scalar HTML
scalar URL
`);
