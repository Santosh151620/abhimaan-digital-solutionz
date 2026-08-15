import Link from "next/link";
import { notFound } from "next/navigation";


import {
    getKnowledgeArticle,
} from "../actions";



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

            <header
                className="
                    flex
                    items-center
                    justify-between
                    gap-4
                "
            >

                <div>

                    <h1 className="text-2xl font-semibold">

                        {article.title}

                    </h1>


                    <p className="text-sm text-muted-foreground">

                        {article.category}

                        {" • "}

                        {article.status}

                    </p>

                </div>


                <Link
                    href={`/en/dashboard/knowledge-base/${id}/edit`}
                    className="
                        rounded-lg
                        border
                        px-4
                        py-2
                        text-sm
                        font-medium
                        transition-colors
                        hover:bg-muted
                    "
                >

                    Edit

                </Link>

            </header>



            {article.summary && (

                <section
                    className="rounded-xl border p-4"
                    aria-labelledby="article-summary"
                >

                    <h2
                        id="article-summary"
                        className="mb-2 font-medium"
                    >

                        Summary

                    </h2>


                    <p className="text-muted-foreground">

                        {article.summary}

                    </p>

                </section>

            )}



            <section
                className="rounded-xl border p-6"
                aria-labelledby="article-content"
            >

                <h2
                    id="article-content"
                    className="mb-3 font-medium"
                >

                    Content

                </h2>


                <div className="whitespace-pre-wrap">

                    {article.content}

                </div>

            </section>



            <section
                className="grid gap-4 md:grid-cols-3"
                aria-label="Article details"
            >

                <div className="rounded-lg border p-4">

                    <div className="text-sm text-muted-foreground">

                        Author

                    </div>


                    <div className="mt-1">

                        {article.author ?? "-"}

                    </div>

                </div>


                <div className="rounded-lg border p-4">

                    <div className="text-sm text-muted-foreground">

                        Views

                    </div>


                    <div className="mt-1">

                        {article.viewCount}

                    </div>

                </div>


                <div className="rounded-lg border p-4">

                    <div className="text-sm text-muted-foreground">

                        Featured

                    </div>


                    <div className="mt-1">

                        {article.featured
                            ? "Yes"
                            : "No"}

                    </div>

                </div>

            </section>



            <Link
                href="/en/dashboard/knowledge-base"
                className="
                    inline-flex
                    text-sm
                    font-medium
                    underline
                    underline-offset-4
                    hover:no-underline
                "
            >

                Back to Knowledge Base

            </Link>

        </div>

    );

}
