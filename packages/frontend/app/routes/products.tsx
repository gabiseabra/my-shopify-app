import { Card, Page, ResourceItem, ResourceList, Text } from "@shopify/polaris";

const products = [
  { id: '', title: 'Black T-shirt', price: '$20.00' },
];

export default function Products() {
  return (
    <Page title="Product List">
      <Card>
        <ResourceList
          resourceName={{ singular: 'product', plural: 'products' }}
          items={products}
          renderItem={(item) => {
            const { id, title, price } = item;
            return (
              <ResourceItem
                id={id}
                url={`/products/${id}`}
              >
                <Text as="h3" variant="bodyMd">{title}</Text>
                <div>{price}</div>
              </ResourceItem>
            );
          }}
        />
      </Card>
    </Page>
  )
}
