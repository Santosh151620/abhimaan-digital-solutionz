export type KnowledgeCategory =
    | 'General'
    | 'Sales'
    | 'Marketing'
    | 'Projects'
    | 'Support'
    | 'Finance'
    | 'HR'
    | 'Technical'
    | 'Administration'
    | 'Other';

export type KnowledgeStatus =
    | 'Draft'
    | 'Published'
    | 'Archived';

export interface KnowledgeArticle {

    id: string;

    articleNumber: string;

    companyId?: string;

    title: string;

    slug: string;

    category: KnowledgeCategory;

    summary?: string;

    content: string;

    tags: string[];

    status: KnowledgeStatus;

    author?: string;

    publishedAt?: string;

    viewCount: number;

    featured: boolean;

    archived: boolean;

    createdAt: string;

    updatedAt: string;

}

export interface KnowledgeSummary {

    total: number;

    draft: number;

    published: number;

    archived: number;

    featured: number;

}