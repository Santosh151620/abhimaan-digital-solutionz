import type {
    KnowledgeArticle,
    KnowledgeStatus,
} from '@/types/crm/KnowledgeBase';

class KnowledgeBaseRepository {

    private articles =
        new Map<string, KnowledgeArticle>();

    list() {

        return Array.from(
            this.articles.values(),
        ).filter(
            article => !article.archived,
        );

    }

    listArchived() {

        return Array.from(
            this.articles.values(),
        ).filter(
            article => article.archived,
        );

    }

    details(
        id: string,
    ) {

        return this.articles.get(id) ?? null;

    }

    create(
        data: Partial<KnowledgeArticle>,
    ): KnowledgeArticle {

        const now =
            new Date().toISOString();

        const article: KnowledgeArticle = {

            id:
                crypto.randomUUID(),

            articleNumber:
                data.articleNumber ??
                `KB-${Date.now()}`,

            companyId:
                data.companyId,

            title:
                data.title ?? '',

            slug:
                data.slug ??
                '',

            category:
                data.category ??
                'General',

            summary:
                data.summary,

            content:
                data.content ?? '',

            tags:
                data.tags ?? [],

            status:
                data.status ??
                'Draft',

            author:
                data.author,

            publishedAt:
                data.publishedAt,

            viewCount:
                0,

            featured:
                data.featured ??
                false,

            archived:
                false,

            createdAt:
                now,

            updatedAt:
                now,

        };

        this.articles.set(
            article.id,
            article,
        );

        return article;

    }

    update(
        id: string,
        data: Partial<KnowledgeArticle>,
    ) {

        const existing =
            this.articles.get(id);

        if (!existing) {

            return null;

        }

        const updated: KnowledgeArticle = {

            ...existing,

            ...data,

            updatedAt:
                new Date().toISOString(),

        };

        this.articles.set(
            id,
            updated,
        );

        return updated;

    }

    updateStatus(
        id: string,
        status: KnowledgeStatus,
    ) {

        return this.update(
            id,
            {
                status,
            },
        );

    }

    delete(
        id: string,
    ) {

        const article =
            this.articles.get(id);

        if (!article) {

            return false;

        }

        article.archived = true;

        article.updatedAt =
            new Date().toISOString();

        this.articles.set(
            id,
            article,
        );

        return true;

    }

    restore(
        id: string,
    ) {

        const article =
            this.articles.get(id);

        if (!article) {

            return false;

        }

        article.archived = false;

        article.updatedAt =
            new Date().toISOString();

        this.articles.set(
            id,
            article,
        );

        return true;

    }

    summary() {

        const articles =
            this.list();

        return {

            total:
                articles.length,

            draft:
                articles.filter(
                    a => a.status === 'Draft',
                ).length,

            published:
                articles.filter(
                    a => a.status === 'Published',
                ).length,

            archived:
                articles.filter(
                    a => a.status === 'Archived',
                ).length,

            featured:
                articles.filter(
                    a => a.featured,
                ).length,

        };

    }

}

export const
    KnowledgeBaseRepositoryInstance =
        new KnowledgeBaseRepository();