import Link from "next/link";
import {
    notFound,
} from "next/navigation";


import {
    KnowledgeBaseForm,
} from "@/components/crm/knowledge-base";


import {
    getKnowledgeArticle,
    updateKnowledgeArticle,
} from "../../actions";



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

            <header>

                <h1 className="text-2xl font-semibold">

                    Edit Knowledge Article

                </h1>


                <p className="text-sm text-muted-foreground">

                    {article.articleNumber}

                </p>

            </header>


            <KnowledgeBaseForm

                initialValues={article}

                onSubmit={
                    async data => {

                        await updateKnowledgeArticle(
                            id,
                            data,
                        );

                    }
                }

            />


            <Link
                href={`/en/dashboard/knowledge-base/${id}`}
                className="
                    inline-flex
                    text-sm
                    font-medium
                    underline
                    underline-offset-4
                    hover:no-underline
                "
            >

                Back to Article

            </Link>

        </div>

    );

}
