import SearchClient from '@/components/crm/search/SearchClient';

export const metadata = {
    title: 'CRM Search',
};

export default function SearchPage() {

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">

                    Global CRM Search

                </h1>

                <p className="text-sm text-muted-foreground">

                    Search across CRM entities from a single place.

                </p>

            </div>

            <SearchClient />

        </div>

    );

}