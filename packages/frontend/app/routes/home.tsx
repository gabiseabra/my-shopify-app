import { redirect } from "react-router";

export const loader = () => {
  return redirect("/products");
};

export default function Home() {
  return null; // This component doesn't need to render anything
}
