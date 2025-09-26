import { useLoaderData } from "react-router-dom";

export const loader = () => {
  return { mensaje: "Hola desde el loader" };
}

export default function SamplePage() {
 const { mensaje } = useLoaderData()

  return (
    <div>
      <h1>{mensaje}</h1>
    </div>
  );
}