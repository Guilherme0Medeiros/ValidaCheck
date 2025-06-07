import ProductShowcase from "@/components/ProductShowcase";

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const res = await fetch(`https://fakestoreapi.com/products/${params.id}`);
  if (!res.ok) {
    return <div>Produto não encontrado</div>;
  }
  const product = await res.json();

  return (
    <main className="flex justify-center items-center min-h-[80vh] bg-background py-8">
      <ProductShowcase product={product} />
    </main>
  );
}
