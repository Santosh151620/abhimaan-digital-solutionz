import Link from "next/link";


import {
    KnowledgeBaseForm,
} from "@/components/crm/knowledge-base";



export default function NewKnowledgeArticlePage() {

    return (

        <div className="space-y-6">

            <header>

                <h1 className="text-2xl font-semibold">

                    Create Knowledge Article

                </h1>


                <p className="text-sm text-muted-foreground">

                    Create and publish internal knowledge,
                    documentation, and SOP content.

                </p>

            </header>


            <KnowledgeBaseForm />


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
