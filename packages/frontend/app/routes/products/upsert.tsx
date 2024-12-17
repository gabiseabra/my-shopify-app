import { gql, useMutation, useQuery } from "@apollo/client/index.js";
import { ProductStatus } from '@my-shopify/backend'
import type { Product, ProductInput } from "@my-shopify/backend";
import { Button, ButtonGroup, FormLayout, InlineStack, Modal, Select, TextField } from "@shopify/polaris";
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

export default function UpsertProduct() {
  const navigate = useNavigate();
  const { handle } = useParams<{ handle: string }>();
  const [state, setState] = useState<ProductInput>(initialProductInput);
  const [loading, setLoading] = useState<boolean>(false);
  const [productUpdate] = useMutation<{ productUpdate: Product }>(UPDATE_PRODUCT);
  const [productCreate] = useMutation<{ productCreate: Product }>(CREATE_PRODUCT);
  const { data, client } = useQuery<{ product: Product }>(GET_PRODUCT, {
    skip: !handle,
    variables: { handle },
    onCompleted(data) {
      setState(mkProductInput(data.product));
    },
  });
  const product: Product | undefined = data?.product;
  const isDirty = !product || compareProductInput(mkProductInput(product), state);
  const isValid = validateProductInput(state);
  const initialLoading = handle && !product;

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (product) {
        await productUpdate({ variables: { id: product?.id, product: state } });
      } else {
        const { data } = await productCreate({ variables: { product: state } });
        if (!data) throw new Error('Failed to create product.')
        await client.writeQuery({
          query: GET_PRODUCT,
          variables: { handle: data.productCreate.handle },
          data: { product: data.productCreate },
        })
        navigate(`/products/${data.productCreate.handle}/edit`, { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open
      onClose={() => navigate('/products')}
      title={(
        initialLoading ? 'Loading...' :
        product ? `Edit Product: ${product.title}` :
        'Create Product'
      )}
    >
      <div style={{ position: 'relative', display: 'grid', gap: 'var(--p-space-400)', padding: 'var(--p-space-400)' }}>
        {loading || initialLoading && <Spinner overlay />}
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
              variant="secondary"
              onClick={() => navigate('/products')}
              accessibilityLabel="Cancel"
            >
              Cancel
            </Button>
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
    </Modal>
  )
}
