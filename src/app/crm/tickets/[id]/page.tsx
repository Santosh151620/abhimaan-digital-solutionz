interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function AssetPage({
    params,
}: Props) {

    const { id } = await params;

    return (
        <div className="">
            Asset {id}
        </div>
    );
}