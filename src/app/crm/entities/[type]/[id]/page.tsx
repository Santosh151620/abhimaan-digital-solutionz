import {
    EntityWorkspaceContainer,
} from '@/components/entities';

interface Props {
    params: Promise<{
        type: string;
        id: string;
    }>;
}

export default async function EntityDetailsPage({
    params,
}: Props) {

    const {
        type,
        id,
    } = await params;

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-3xl font-bold capitalize">
                    {type}
                </h1>

                <p className="text-muted-foreground">
                    Entity Workspace
                </p>

            </div>

            <EntityWorkspaceContainer
                entityType={type}
                entityId={id}
            />

        </div>

    );

}