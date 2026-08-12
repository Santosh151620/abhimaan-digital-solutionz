"use client";

import Link from "next/link";
import {
    CheckCircle2,
    Eye,
    FileText,
    Star,
} from "lucide-react";

import type {
    KnowledgeArticle,
} from "@/types/crm/KnowledgeBase";

interface Props {
    articles: KnowledgeArticle[];
}

function getStatusClasses(status: string): string {
    switch (status.toLowerCase()) {
        case "published":
            return [
                "border-emerald-400/20",
                "bg-emerald-400/10",
                "text-emerald-300",
            ].join(" ");

        case "draft":
            return [
                "border-amber-400/20",
                "bg-amber-400/10",
                "text-amber-300",
            ].join(" ");

        case "archived":
            return [
                "border-slate-400/20",
                "bg-slate-400/10",
                "text-slate-400",
            ].join(" ");

        default:
            return [
                "border-white/10",
                "bg-white/[0.04]",
                "text-slate-300",
            ].join(" ");
    }
}

export default function KnowledgeBaseTable({
    articles,
}: Props) {
    if (articles.length === 0) {
        return (
            <div
                className="
                    flex
                    min-h-[240px]
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    px-6
                    py-10
                    text-center
                "
            >
                <div
                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        text-slate-500
                    "
                >
                    <FileText
                        aria-hidden="true"
                        className="h-5 w-5"
                    />
                </div>

                <h3
                    className="
                        mt-4
                        text-sm
                        font-semibold
                        text-white
                    "
                >
                    No knowledge base articles found
                </h3>

                <p
                    className="
                        mt-1
                        max-w-md
                        text-xs
                        leading-5
                        text-slate-500
                    "
                >
                    Published and draft knowledge articles will
                    appear here when they are available.
                </p>
            </div>
        );
    }

    return (
        <div
            className="
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-white/[0.02]
                shadow-xl
                shadow-black/10
            "
        >
            {/* Desktop/tablet table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <caption className="sr-only">
                        Knowledge base articles
                    </caption>

                    <thead>
                        <tr
                            className="
                                border-b
                                border-white/10
                                bg-white/[0.035]
                                text-left
                            "
                        >
                            <th
                                scope="col"
                                className="
                                    px-4
                                    py-3
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-500
                                "
                            >
                                Article
                            </th>

                            <th
                                scope="col"
                                className="
                                    px-4
                                    py-3
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-500
                                "
                            >
                                Category
                            </th>

                            <th
                                scope="col"
                                className="
                                    px-4
                                    py-3
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-500
                                "
                            >
                                Status
                            </th>

                            <th
                                scope="col"
                                className="
                                    px-4
                                    py-3
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-500
                                "
                            >
                                Author
                            </th>

                            <th
                                scope="col"
                                className="
                                    px-4
                                    py-3
                                    text-right
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-500
                                "
                            >
                                Views
                            </th>

                            <th
                                scope="col"
                                className="
                                    px-4
                                    py-3
                                    text-center
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-500
                                "
                            >
                                Featured
                            </th>

                            <th
                                scope="col"
                                className="
                                    px-4
                                    py-3
                                    text-right
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-500
                                "
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-white/[0.07]">
                        {articles.map((article) => (
                            <tr
                                key={article.id}
                                className="
                                    group
                                    transition-colors
                                    hover:bg-white/[0.035]
                                "
                            >
                                {/* Article */}
                                <td className="px-4 py-4 align-top">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div
                                            className="
                                                mt-0.5
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                border
                                                border-amber-300/10
                                                bg-amber-300/[0.06]
                                                text-amber-200
                                            "
                                        >
                                            <FileText
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <div
                                                className="
                                                    max-w-[360px]
                                                    truncate
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                "
                                                title={article.title}
                                            >
                                                {article.title}
                                            </div>

                                            {article.summary && (
                                                <div
                                                    className="
                                                        mt-1
                                                        max-w-[420px]
                                                        truncate
                                                        text-xs
                                                        leading-5
                                                        text-slate-500
                                                    "
                                                    title={article.summary}
                                                >
                                                    {article.summary}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Category */}
                                <td
                                    className="
                                        whitespace-nowrap
                                        px-4
                                        py-4
                                        align-top
                                        text-sm
                                        text-slate-300
                                    "
                                >
                                    {article.category || "-"}
                                </td>

                                {/* Status */}
                                <td className="px-4 py-4 align-top">
                                    <span
                                        className={[
                                            "inline-flex",
                                            "items-center",
                                            "rounded-full",
                                            "border",
                                            "px-2.5",
                                            "py-1",
                                            "text-[10px]",
                                            "font-semibold",
                                            "capitalize",
                                            getStatusClasses(
                                                article.status,
                                            ),
                                        ].join(" ")}
                                    >
                                        {article.status}
                                    </span>
                                </td>

                                {/* Author */}
                                <td
                                    className="
                                        max-w-[180px]
                                        truncate
                                        px-4
                                        py-4
                                        align-top
                                        text-sm
                                        text-slate-400
                                    "
                                    title={
                                        article.author ??
                                        undefined
                                    }
                                >
                                    {article.author || "-"}
                                </td>

                                {/* Views */}
                                <td
                                    className="
                                        whitespace-nowrap
                                        px-4
                                        py-4
                                        text-right
                                        align-top
                                        text-sm
                                        font-medium
                                        text-slate-300
                                    "
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <Eye
                                            aria-hidden="true"
                                            className="
                                                h-3.5
                                                w-3.5
                                                text-slate-500
                                            "
                                        />

                                        {article.viewCount.toLocaleString()}
                                    </span>
                                </td>

                                {/* Featured */}
                                <td className="px-4 py-4 text-center align-top">
                                    {article.featured ? (
                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-amber-300/20
                                                bg-amber-300/10
                                                p-1.5
                                                text-amber-300
                                            "
                                            title="Featured article"
                                        >
                                            <Star
                                                aria-hidden="true"
                                                className="
                                                    h-3.5
                                                    w-3.5
                                                    fill-current
                                                "
                                            />

                                            <span className="sr-only">
                                                Featured
                                            </span>
                                        </span>
                                    ) : (
                                        <span
                                            className="
                                                text-slate-600
                                            "
                                            aria-label="Not featured"
                                        >
                                            -
                                        </span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-4 text-right align-top">
                                    <Link
                                        href={`/crm/knowledge-base/${article.id}`}
                                        onClick={() => {
                                            // Keep navigation explicit and
                                            // side-effect free.
                                        }}
                                        aria-label={`View article ${article.title}`}
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1.5
                                            rounded-lg
                                            border
                                            border-white/10
                                            bg-white/[0.03]
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-medium
                                            text-slate-300
                                            transition
                                            hover:border-amber-300/30
                                            hover:bg-amber-300/10
                                            hover:text-amber-200
                                            focus-visible:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-amber-300/50
                                        "
                                    >
                                        <CheckCircle2
                                            aria-hidden="true"
                                            className="h-3.5 w-3.5"
                                        />

                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile fallback */}
            <div className="divide-y divide-white/[0.07] md:hidden">
                {articles.map((article) => (
                    <article
                        key={`mobile-${article.id}`}
                        className="p-4"
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-amber-300/10
                                    bg-amber-300/[0.06]
                                    text-amber-200
                                "
                            >
                                <FileText
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3
                                    className="
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-white
                                    "
                                    title={article.title}
                                >
                                    {article.title}
                                </h3>

                                {article.summary && (
                                    <p
                                        className="
                                            mt-1
                                            line-clamp-2
                                            text-xs
                                            leading-5
                                            text-slate-500
                                        "
                                    >
                                        {article.summary}
                                    </p>
                                )}

                                <div
                                    className="
                                        mt-3
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                    "
                                >
                                    <span
                                        className={[
                                            "inline-flex",
                                            "items-center",
                                            "rounded-full",
                                            "border",
                                            "px-2",
                                            "py-1",
                                            "text-[10px]",
                                            "font-semibold",
                                            "capitalize",
                                            getStatusClasses(
                                                article.status,
                                            ),
                                        ].join(" ")}
                                    >
                                        {article.status}
                                    </span>

                                    <span
                                        className="
                                            text-[11px]
                                            text-slate-500
                                        "
                                    >
                                        {article.category || "-"}
                                    </span>

                                    <span
                                        className="
                                            text-[11px]
                                            text-slate-500
                                        "
                                    >
                                        {article.viewCount.toLocaleString()} views
                                    </span>

                                    {article.featured && (
                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                gap-1
                                                text-[10px]
                                                font-medium
                                                text-amber-300
                                            "
                                        >
                                            <Star
                                                aria-hidden="true"
                                                className="
                                                    h-3
                                                    w-3
                                                    fill-current
                                                "
                                            />
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <Link
                                        href={`/crm/knowledge-base/${article.id}`}
                                        aria-label={`View article ${article.title}`}
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1.5
                                            rounded-lg
                                            border
                                            border-white/10
                                            bg-white/[0.03]
                                            px-3
                                            py-2
                                            text-xs
                                            font-medium
                                            text-slate-300
                                            transition
                                            hover:border-amber-300/30
                                            hover:bg-amber-300/10
                                            hover:text-amber-200
                                            focus-visible:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-amber-300/50
                                        "
                                    >
                                        <Eye
                                            aria-hidden="true"
                                            className="h-3.5 w-3.5"
                                        />

                                        View Article
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}