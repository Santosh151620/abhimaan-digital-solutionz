'use client';

import Link from 'next/link';

import type {
    KnowledgeArticle,
} from '@/types/crm/KnowledgeBase';

interface Props {

    articles: KnowledgeArticle[];

}

export default function KnowledgeBaseTable({
    articles,
}: Props) {

    if (articles.length === 0) {

        return (

            <div className="rounded-xl border p-8 text-center text-muted-foreground">
                No knowledge base articles found.
            </div>

        );

    }

    return (

        <div className="overflow-x-auto rounded-xl border">

            <table className="w-full">

                <thead>

                    <tr className="border-b bg-muted/40 text-left">

                        <th className="p-3">
                            Title
                        </th>

                        <th className="p-3">
                            Category
                        </th>

                        <th className="p-3">
                            Status
                        </th>

                        <th className="p-3">
                            Author
                        </th>

                        <th className="p-3">
                            Views
                        </th>

                        <th className="p-3 text-center">
                            Featured
                        </th>

                        <th className="p-3 text-right">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        articles.map(article => (

                            <tr
                                key={article.id}
                                className="border-b hover:bg-muted/30"
                            >

                                <td className="p-3">

                                    <div className="font-medium">
                                        {article.title}
                                    </div>

                                    {
                                        article.summary && (

                                            <div className="text-sm text-muted-foreground">
                                                {article.summary}
                                            </div>

                                        )
                                    }

                                </td>

                                <td className="p-3">
                                    {article.category}
                                </td>

                                <td className="p-3">
                                    {article.status}
                                </td>

                                <td className="p-3">
                                    {article.author ?? '-'}
                                </td>

                                <td className="p-3">
                                    {article.viewCount}
                                </td>

                                <td className="p-3 text-center">
                                    {
                                        article.featured
                                            ? '★'
                                            : '-'
                                    }
                                </td>

                                <td className="p-3 text-right">

                                    <Link
                                        href={`/crm/knowledge-base/${article.id}`}
                                        className="rounded border px-3 py-1 text-sm"
                                    >
                                        View
                                    </Link>

                                </td>

                            </tr>

                        ))
                    }

                </tbody>

            </table>

        </div>

    );

}