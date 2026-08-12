import Link from "next/link";

import {
    ProductsServiceInstance,
} from "@/services/crm/ProductsService";

interface ProductDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductDetailsPage({
    params,
}: ProductDetailsPageProps) {
    const { id } = await params;

    const products = await ProductsServiceInstance.list();

    const product = products.find(
        (item) => String(item.id) === id,
    );

    if (!product) {
        return (
            <main className="min-w-0 space-y-6 p-4 sm:p-6">
                <div
                    className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        p-8
                        text-center
                    "
                >
                    <h1 className="text-xl font-semibold text-white">
                        Product Not Found
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        The requested product could not be found.
                    </p>

                    <Link
                        href="/crm/products"
                        className="
                            mt-6
                            inline-flex
                            rounded-xl
                            bg-amber-400
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-slate-950
                            transition
                            hover:bg-amber-300
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-amber-300/50
                        "
                    >
                        Back to Products
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main
            aria-labelledby="product-details-title"
            className="min-w-0 space-y-6 p-4 sm:p-6"
        >
            <header
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-amber-300">
                        Product
                    </p>

                    <h1
                        id="product-details-title"
                        className="
                            mt-1
                            truncate
                            text-2xl
                            font-bold
                            tracking-tight
                            text-white
                            sm:text-3xl
                        "
                    >
                        {product.name}
                    </h1>
                </div>

                <Link
                    href="/crm/products"
                    className="
                        inline-flex
                        w-fit
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-slate-300
                        transition
                        hover:border-amber-300/30
                        hover:bg-amber-300/10
                        hover:text-white
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-amber-300/50
                    "
                >
                    Back to Products
                </Link>
            </header>

            <section
                aria-label="Product information"
                className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-6
                    shadow-xl
                "
            >
                <dl className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <dt className="text-xs uppercase tracking-wider text-slate-500">
                            Product Name
                        </dt>

                        <dd className="mt-1 text-sm font-medium text-white">
                            {product.name}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-xs uppercase tracking-wider text-slate-500">
                            Product ID
                        </dt>

                        <dd className="mt-1 break-all text-sm text-slate-300">
                            {product.id}
                        </dd>
                    </div>
                </dl>
            </section>
        </main>
    );
}