import { gql, useQuery } from '@apollo/client/index.js'
import { ProductStatus } from '@my-shopify/backend'
import type { PageInfo, Product, ProductConnection } from '@my-shopify/backend'
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  InlineStack,
  Page,
  ResourceItem,
  ResourceList,
  Text,
  Thumbnail,
} from '@shopify/polaris'
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from '@shopify/polaris-icons'
import { Link, Outlet } from 'react-router'
import Spinner from '~/components/Spinner'

const PRODUCTS_PER_PAGE = 5

const GET_PRODUCTS = gql`
  query getProducts($first: Int, $after: String, $last: Int, $before: String) {
    products(first: $first, after: $after, last: $last, before: $before) {
      edges {
        cursor
        node {
          id
          title
          handle
          sku
          status
          image {
            alt
            url
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

export default function ListProducts() {
  const { data, fetchMore, loading } = useQuery<{
    products: ProductConnection
  }>(GET_PRODUCTS, {
    variables: { first: PRODUCTS_PER_PAGE },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  })
  const products: Product[] = data?.products.edges.map(({ node }) => node) ?? []
  const pageInfo: PageInfo | undefined = data?.products.pageInfo

  const onLoadNextPage = () => {
    if (!pageInfo) return
    fetchMore({
      variables: {
        first: PRODUCTS_PER_PAGE,
        after: pageInfo.endCursor,
        last: null,
        before: null,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        return fetchMoreResult ? fetchMoreResult : prevResult
      },
    })
  }

  const onLoadPreviousPage = () => {
    if (!pageInfo) return
    fetchMore({
      variables: {
        first: null,
        after: null,
        last: PRODUCTS_PER_PAGE,
        before: pageInfo.startCursor,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        return fetchMoreResult ? fetchMoreResult : prevResult
      },
    })
  }

  if (!data) return <Spinner />

  return (
    <Page title="Product List">
      <Card>
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gap: 'var(--p-space-400)',
          }}
        >
          {loading && <Spinner overlay />}
          <ResourceList<Product>
            resourceName={{ singular: 'product', plural: 'products' }}
            items={products}
            renderItem={renderProduct}
          />
          <InlineStack>
            <Link to="/products/new">
              <Button
                variant="secondary"
                accessibilityLabel="Create new product"
                icon={PlusIcon}
              >
                Create new product
              </Button>
            </Link>

            <div style={{ flex: 1 }} />

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
          </InlineStack>
        </div>
      </Card>
      <Outlet />
    </Page>
  )
}

const renderProduct = (product: Product) => (
  <ResourceItem
    key={product.id}
    id={product.id}
    url={`/products/${product.handle}/edit`}
    media={
      <Thumbnail
        size="medium"
        source={product.image?.url ?? 'https://placehold.co/500x500'}
        alt={product.image?.alt ?? 'Placeholder'}
      />
    }
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 8,
      }}
    >
      <Text as="h4" variant="headingXl">
        {product.title}
      </Text>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text as="span">
          <b>SKU:</b> {product.sku}
        </Text>
        <StatusBadge status={product.status} />
      </div>
    </div>
  </ResourceItem>
)

const StatusBadge = ({ status }: { status: ProductStatus }) => {
  switch (status) {
    case ProductStatus.Draft:
      return <Badge tone="info">Draft</Badge>
    case ProductStatus.Active:
      return <Badge tone="success">Active</Badge>
    case ProductStatus.Archived:
      return <Badge>Archived</Badge>
  }
}
