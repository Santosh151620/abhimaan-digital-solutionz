import {
    ProductsServiceInstance,
} from "@/services/crm/ProductsService";

import {
    ProductsClient,
    ProductsSummary,
} from "@/components/crm/products";

export default async function ProductsPage() {
    const [products, summary] = await Promise.all([
        ProductsServiceInstance.list(),
        ProductsServiceInstance.summary(),
    ]);

    return (
        <main
            aria-labelledby="products-page-title"
            className="
                min-w-0
                space-y-6
                p-4
                sm:p-6
            "
        >
            <header>
                <h1
                    id="products-page-title"
                    className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-white
                        sm:text-3xl
                    "
                >
                    Products
                </h1>

                <p
                    className="
                        mt-1
                        max-w-3xl
                        text-sm
                        leading-6
                        text-slate-400
                    "
                >
                    Manage products, pricing, availability,
                    and catalog information.
                </p>
            </header>

            <section
                aria-label="Product summary"
                className="min-w-0"
            >
                <ProductsSummary summary={summary} />
            </section>

            <section
                aria-label="Products"
                className="min-w-0"
            >
                <ProductsClient products={products} />
            </section>
        </main>
    );
}