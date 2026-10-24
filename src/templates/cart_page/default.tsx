import { MainCart } from "@/sections/MainCart";
import { PageHeader } from "@/sections/PageHeader";

export default function CartPageDefault() {
  return (
    <>
      <PageHeader title="Your cart" />
      <section className="page-width">
        <MainCart />
      </section>
    </>
  );
}
