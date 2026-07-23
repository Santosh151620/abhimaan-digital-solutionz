'use client';

import { useState } from 'react';

import {
    KnowledgeBaseForm,
    KnowledgeBaseSummary,
    KnowledgeBaseTable,
} from './index';

import type {
    KnowledgeArticle,
    KnowledgeSummary,
} from '@/types/crm/KnowledgeBase';

interface Props {

    initialArticles: KnowledgeArticle[];

}

export default function KnowledgeBaseClient({
    initialArticles,
}: Props) {

    const [articles, setArticles] =
        useState<KnowledgeArticle[]>(
            initialArticles,
        );

    const [showForm, setShowForm] =
        useState(false);

    async function createArticle(
        values: Partial<KnowledgeArticle>,
    ) {

        const now =
            new Date().toISOString();

        const article: KnowledgeArticle = {

            id:
                crypto.randomUUID(),

            articleNumber:
                `KB-${Date.now()}`,

            companyId:
                values.companyId,

            title:
                values.title ?? '',

            slug:
                values.slug ??
                (values.title ?? '')
                    .toLowerCase()
                    .replaceAll(' ', '-'),

            category:
                values.category ??
                'General',

            summary:
                values.summary,

            content:
                values.content ?? '',

            tags:
                values.tags ?? [],

            status:
                values.status ??
                'Draft',

            author:
                values.author,

            publishedAt:
                values.publishedAt,

            viewCount:
                0,

            featured:
                values.featured ??
                false,

            archived:
                false,

            createdAt:
                now,

            updatedAt:
                now,

        };

        setArticles(previous => [
            article,
            ...previous,
        ]);

        setShowForm(false);

    }

    const summary: KnowledgeSummary = {

        total:
            articles.length,

        draft:
            articles.filter(
                article =>
                    article.status ===
                    'Draft',
            ).length,

        published:
            articles.filter(
                article =>
                    article.status ===
                    'Published',
            ).length,

        archived:
            articles.filter(
                article =>
                    article.status ===
                    'Archived',
            ).length,

        featured:
            articles.filter(
                article =>
                    article.featured,
            ).length,

    };

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-semibold">
                        Knowledge Base
                    </h1>

                    <p className="text-muted-foreground">
                        Internal documentation and articles.
                    </p>

                </div>

                <button
                    onClick={() =>
                        setShowForm(true)
                    }
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    New Article
                </button>

            </div>

            <KnowledgeBaseSummary
                summary={summary}
            />

            {
                showForm && (

                    <KnowledgeBaseForm
                        onSubmit={
                            createArticle
                        }
                        onCancel={() =>
                            setShowForm(false)
                        }
                    />

                )
            }

            <KnowledgeBaseTable
                articles={articles}
            />

        </div>

    );

}