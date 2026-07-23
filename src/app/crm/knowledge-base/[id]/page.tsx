import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
    getKnowledgeArticle,
} from '../actions';

interface Props {

    params: Promise<{
        id: string;
    }>;

}

export default async function KnowledgeArticlePage({
    params,
}: Props) {

    const {
        id,
    } = await params;

    const article =
        await getKnowledgeArticle(
            id,
        );

    if (!article) {

        notFound();

    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-semibold">
                        {article.title}
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        {article.category} • {article.status}
                    </p>

                </div>

                <Link
                    href={`/crm/knowledge-base/${id}/edit`}
                    className="rounded-lg border px-4 py-2"
                >
                    Edit
                </Link>

            </div>

            {
                article.summary && (

                    <div className="rounded-xl border p-4">
                        <h2 className="mb-2 font-medium">
                            Summary
                        </h2>

                        <p>
                            {article.summary}
                        </p>
                    </div>

                )
            }

            <div className="rounded-xl border p-6">

                <h2 className="mb-3 font-medium">
                    Content
                </h2>

                <div className="whitespace-pre-wrap">
                    {article.content}
                </div>

            </div>

            <div className="grid gap-4 md:grid-cols-3">

                <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">
                        Author
                    </div>
                    <div>
                        {article.author ?? '-'}
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">
                        Views
                    </div>
                    <div>
                        {article.viewCount}
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">
                        Featured
                    </div>
                    <div>
                        {article.featured ? 'Yes' : 'No'}
                    </div>
                </div>

            </div>

            <Link
                href="/crm/knowledge-base"
                className="text-sm underline"
            >
                Back to Knowledge Base
            </Link>

        </div>

    );

}