import { gql } from "../utils/graphql-tag";

export const MediaFragment = gql`
  fragment MediaFragment on Media {
    id
    alt
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
`;

export const ProductFragment = gql`
  fragment ProductFragment on Product {
    id
    status
    title
    handle
    defaultCursor
    descriptionHtml
    featuredMedia { ...MediaFragment }
    seo { title, description }
  }
  ${MediaFragment}
`;

export const PageInfoFragment = gql`
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;
