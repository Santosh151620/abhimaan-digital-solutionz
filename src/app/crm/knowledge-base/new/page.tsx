import Link from 'next/link';

import {
    KnowledgeBaseForm,
} from '@/components/crm/knowledge-base';

export default function NewKnowledgeArticlePage() {

    return (

        <div className="space-y-6">

            <h1 className="text-2xl font-semibold">
                Create Knowledge Article
            </h1>

            <KnowledgeBaseForm />

            <Link
                href="/crm/knowledge-base"
                className="text-sm underline"
            >
                Back to Knowledge Base
            </Link>

        </div>

    );

}