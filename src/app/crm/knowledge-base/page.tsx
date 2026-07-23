import {
    KnowledgeBaseClient,
} from '@/components/crm/knowledge-base';

import {
    getKnowledgeArticles,
} from './actions';

export default async function KnowledgeBasePage() {

    const articles =
        await getKnowledgeArticles();

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Knowledge Base
                </h1>

                <p className="text-sm text-muted-foreground">
                    Articles, documentation, SOPs and internal knowledge.
                </p>

            </div>

            <KnowledgeBaseClient
                initialArticles={articles}
            />

        </div>

    );

}