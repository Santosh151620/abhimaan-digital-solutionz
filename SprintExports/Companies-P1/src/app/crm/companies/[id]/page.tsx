interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CompaniesDetailsPage(
    { params }: PageProps
) {

    const { id } = await params;

    return <div>{id}</div>;

}
