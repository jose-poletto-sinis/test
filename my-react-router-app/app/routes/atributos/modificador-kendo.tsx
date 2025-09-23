import App from "../../components/app";
import { ClientOnly } from "../../components/clientsOnly";

export default function ModificadorKendo() {
  return (
    <ClientOnly>
      <App />
    </ClientOnly>
  );
}
