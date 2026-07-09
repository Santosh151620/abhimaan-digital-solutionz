interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCompaniesPage({ params }: PageProps) {
    const { id } = await params;

    return <div>Edit Companies : {id}</div>;
}
