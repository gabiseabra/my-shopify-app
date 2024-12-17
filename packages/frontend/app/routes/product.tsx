import { gql, useMutation, useQuery } from "@apollo/client/index.js";
import { ProductStatus, type Product, type ProductInput } from "@my-shopify/backend";
import { Button, ButtonGroup, Card, FormLayout, InlineStack, Page, Select, TextField } from "@shopify/polaris";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Spinner from "~/components/Spinner";

const ProductFragment = gql`
  fragment ProductFragment on Product {
    id
    title
    handle
    sku
    status
  }
`

const GET_PRODUCT = gql`
  query getProduct($handle: String!) {
    product(handle: $handle) { ...ProductFragment }
  }
  ${ProductFragment}
`

const UPDATE_PRODUCT = gql`
  mutation productUpdate($id: ID!, $product: ProductInput!) {
    productUpdate(id: $id, product: $product) { ...ProductFragment }
  }
  ${ProductFragment}
`

const CREATE_PRODUCT = gql`
  mutation productCreate($product: ProductInput!) {
    productCreate(product: $product) { ...ProductFragment }
  }
  ${ProductFragment}
`

const initialProductInput: ProductInput = {
  title: '',
  sku: '',
  status: ProductStatus.Draft,
}

const mkProductInput = (product: Product): ProductInput => ({
  title: product.title,
  sku: product.sku,
  status: product.status,
})

const compareProductInput = (a: ProductInput, b: ProductInput): boolean => (
  a.title !== b.title || a.sku !== b.sku || a.status !== b.status
)

const validateProductInput = (input: ProductInput): boolean => Boolean(
  input.title && input.title.trim().length > 0
)

export default function Products() {
  const navigate = useNavigate();
  const { handle } = useParams<{ handle: string }>();
  const [state, setState] = useState<ProductInput>(initialProductInput);
  const [loading, setLoading] = useState<boolean>(false);
  const [productUpdate] = useMutation<{ productUpdate: Product }>(UPDATE_PRODUCT);
  const [productCreate] = useMutation<{ productCreate: Product }>(CREATE_PRODUCT);
  const { data } = useQuery<{ product: Product }>(GET_PRODUCT, {
    skip: !handle,
    variables: { handle },
    onCompleted(data) {
      setState(mkProductInput(data.product));
    },
  });
  const product: Product | undefined = data?.product;
  const isDirty = !product || compareProductInput(mkProductInput(product), state);
  const isValid = validateProductInput(state);

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (product) {
        await productUpdate({ variables: { id: product?.id, product: state } });
      } else {
        const { data } = await productCreate({ variables: { product: state } });
        console.log(data);
        if (data?.productCreate) navigate(`/products/${data.productCreate.handle}/edit`, { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  if (handle && !product) return <Spinner />;

  return (
    <Page title={product ? `Edit Product: ${product.title}` : 'Create Product'}>
      <Card>
        <div style={{ position: 'relative', display: 'grid', gap: 'var(--p-space-400)' }}>
          {loading && <Spinner overlay />}
          <FormLayout>
            <TextField
              autoComplete="off"
              label="Title"
              value={state.title ?? ""}
              onChange={(title) => setState({ ...state, title })}
            />
            <TextField
              autoComplete="off"
              label="SKU"
              value={state.sku ?? ""}
              onChange={(sku) => setState({ ...state, sku })}
            />
            <Select
              label="Status"
              disabled={!handle}
              options={[
                { label: 'Active', value: ProductStatus.Active },
                { label: 'Draft', value: ProductStatus.Draft },
                { label: 'Archived', value: ProductStatus.Archived },
              ]}
              value={state.status ?? ProductStatus.Draft}
              onChange={(status) => setState({ ...state, status: status as ProductStatus })}
            />
          </FormLayout>

          <InlineStack align="end">
            <ButtonGroup>
              <Button
                disabled={!isDirty || !isValid || loading}
                variant="primary"
                onClick={onSubmit}
                accessibilityLabel="Next page"
              >
                {product ? 'Save' : 'Create'}
              </Button>
            </ButtonGroup>
          </InlineStack>
        </div>
      </Card>
    </Page>
  )
}
