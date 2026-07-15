interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditAssetPage({
    params,
}: Props) {
    const { id } = await params;

    return (
        <div className="p-6">
            Edit Asset {id}
        </div>
    );
}