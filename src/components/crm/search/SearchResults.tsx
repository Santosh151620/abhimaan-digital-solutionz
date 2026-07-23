import type {
    SearchResult,
} from '@/types/crm/Search';

interface Props {

    results: SearchResult[];

}

export default function SearchResults({
    results,
}: Props) {

    if (results.length === 0) {

        return (

            <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">

                No results found.

            </div>

        );

    }

    return (

        <div className="space-y-3">

            {results.map(result => (

                <div
                    key={result.id}
                    className="rounded-md border p-4"
                >

                    <div className="font-medium">

                        {result.title}

                    </div>

                    {result.subtitle && (

                        <div className="text-sm text-muted-foreground">

                            {result.subtitle}

                        </div>

                    )}

                    {result.description && (

                        <div className="mt-2 text-sm">

                            {result.description}

                        </div>

                    )}

                    <div className="mt-3 text-xs text-muted-foreground">

                        {result.entityType}

                    </div>

                </div>

            ))}

        </div>

    );

}