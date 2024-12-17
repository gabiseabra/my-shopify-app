import { gql, useQuery } from "@apollo/client/index.js";
import type { PageInfo, Product, ProductConnection } from "@my-shopify/backend";
import { Button, ButtonGroup, Card, Page, ResourceItem, ResourceList, Text } from "@shopify/polaris";
import { ArrowLeftIcon, ArrowRightIcon } from "@shopify/polaris-icons";
import Image from "~/components/Image";
import Spinner from "~/components/Spinner";

const PRODUCTS_PER_PAGE = 5;

const GET_PRODUCTS = gql`
  query getProducts($first: Int, $after: String, $last: Int, $before: String) {
    products(first: $first, after: $after, last: $last, before: $before) {
      edges {
        cursor
        node {
          id
          status
          title
          handle
          defaultCursor
          descriptionHtml
          seo { title, description }
          featuredMedia {
            alt
            preview {
              image {
                url
              }
            }
          }
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
`

export default function Products() {
  const { data, fetchMore, loading } = useQuery<{ products: ProductConnection }>(GET_PRODUCTS, {
    variables: { first: PRODUCTS_PER_PAGE },
    notifyOnNetworkStatusChange: true,
  });
  const products: Product[] = data?.products.edges.map(({ node }) => node) ?? [];
  const pageInfo: PageInfo | undefined = data?.products.pageInfo;

  const onLoadNextPage = () => {
    if (!pageInfo) return;
    fetchMore({
      variables: { first: PRODUCTS_PER_PAGE, after: pageInfo.endCursor, last: null, before: null },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        return fetchMoreResult ? fetchMoreResult : prevResult;
      },
    });
  };

  const onLoadPreviousPage = () => {
    if (!pageInfo) return;
    fetchMore({
      variables: { first: null, after: null, last: PRODUCTS_PER_PAGE, before: pageInfo.startCursor },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        return fetchMoreResult ? fetchMoreResult : prevResult;
      },
    });
  };

  if (!data) return <Spinner />;

  return (
    <Page title="Product List">
      <Card>
        <div style={{ position: 'relative' }}>
          {loading && <Spinner overlay />}
          <ResourceList<Product>
            resourceName={{ singular: 'product', plural: 'products' }}
            items={products}
            renderItem={(product) => (
              <ResourceItem
                key={product.id}
                id={product.id}
                url={`/products/${product.handle}`}
                media={
                  <Image
                    width={100}
                    height={100}
                    src={product.featuredMedia?.preview?.image?.url ?? 'https://placehold.co/500x500'}
                    alt={product.featuredMedia?.alt ?? "Placeholder"}
                  />
                }
              >
                <Text as="h3" variant="bodyLg">{product.title}</Text>
              </ResourceItem>
            )}
          />
          <ButtonGroup>
            <Button
              disabled={!pageInfo!.hasPreviousPage || loading}
              onClick={onLoadPreviousPage}
              icon={ArrowLeftIcon}
              accessibilityLabel="Previous page"
            />
            <Button
              disabled={!pageInfo!.hasNextPage || loading}
              onClick={onLoadNextPage}
              icon={ArrowRightIcon}
              accessibilityLabel="Next page"
            />
          </ButtonGroup>
        </div>
      </Card>
    </Page>
  )
}
