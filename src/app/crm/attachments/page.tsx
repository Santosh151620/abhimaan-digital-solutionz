import {
    AttachmentClient,
} from '@/components/crm/attachments';

import {
    createAttachmentRepository,
} from '@/repositories/crm/AttachmentRepository';

import {
    createClient,
} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AttachmentsPage() {
    const supabase =
        await createClient();

    const repository =
        createAttachmentRepository(
            supabase,
        );

    const attachments =
        await repository.list(
            undefined,
            undefined,
            false,
            false,
        );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">
                    Attachments
                </h1>

                <p className="text-sm text-muted-foreground">
                    Manage CRM entity attachments.
                </p>
            </div>

            <AttachmentClient
                initialAttachments={
                    attachments
                }
            />
        </div>
    );
}