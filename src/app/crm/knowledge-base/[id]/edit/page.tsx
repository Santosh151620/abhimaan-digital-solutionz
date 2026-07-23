import Link from 'next/link';
import {
    notFound,
} from 'next/navigation';

import {
    KnowledgeBaseForm,
} from '@/components/crm/knowledge-base';

import {
    getKnowledgeArticle,
} from '../../actions';

interface Props {

    params: Promise<{
        id: string;
    }>;

}

export default async function EditKnowledgeArticlePage({
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

            <div>

                <h1 className="text-2xl font-semibold">
                    Edit Knowledge Article
                </h1>

                <p className="text-sm text-muted-foreground">
                    {article.articleNumber}
                </p>

            </div>

            <KnowledgeBaseForm

                initialValues={article}

                onSubmit={async () => {}}

            />

            <Link
                href={`/crm/knowledge-base/${id}`}
                className="text-sm underline"
            >
                Back to Article
            </Link>

        </div>

    );

}