import Link from 'next/link';

import AssetsSummary from '@/components/crm/assets/AssetsSummary';
import AssetsTable from '@/components/crm/assets/AssetsTable';

//import type { Asset } from '@/types/crm/Assets';

import {
    listAssets,
} from './actions';

export default async function AssetsPage() {

    const assets = await listAssets();
    return (
        <div className="crm-page space-y-8">

            <div className="flex items-center justify-between">

                <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl">

                    <h1 className="bg-gradient-to-r from-cyan-300 via-blue-300 to-emerald-300 bg-clip-text text-4xl font-black text-transparent">

                        Assets

                    </h1>

                    <p className="mt-2 text-slate-400">

                        Manage customer assets and lifecycle tracking.

                    </p>

                </div>

                <Link
                    href="/crm/assets/new"
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    + New Asset
                </Link>

            </div>

            <AssetsSummary
                assets={assets}
            />

            <div className="rounded-xl border bg-card p-4">

                <input
                    type="text"
                    placeholder="Search assets..."
                    className="w-full rounded-lg border bg-background px-3 py-2"
                />

            </div>

            {assets.length === 0 ? (

                <div className="rounded-xl border bg-card p-12 text-center">

                    <h2 className="text-xl font-semibold">
                        No Assets Found
                    </h2>

                    <p className="mt-2 text-muted-foreground">
                        Click <strong>New Asset</strong> to create your first asset.
                    </p>

                </div>

            ) : (

                <AssetsTable
                    assets={assets}
                />

            )}

        </div>
    );
}