interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function AssetDetailsPage({
    params,
}: Props) {
    const { id } = await params;

    return (
        <div className="p-6">
            Asset {id}
        </div>
    );
}