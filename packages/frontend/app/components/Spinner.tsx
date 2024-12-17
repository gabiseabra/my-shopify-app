import { Spinner as BaseSpinner } from "@shopify/polaris";

export default function Spinner(props: {
  overlay?: boolean;
}) {
  return <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    ...(props.overlay ? {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: "rgba(255, 255, 255, 0.75)",
      zIndex: 100,
    } : {})
  }}><BaseSpinner /></div>;
}
