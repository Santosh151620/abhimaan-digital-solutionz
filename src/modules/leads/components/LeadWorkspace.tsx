'use client';

import EntityWorkspace from '@/components/entities/EntityWorkspace';

export interface LeadWorkspaceProps {
  entityId: string;
}

export default function LeadWorkspace(
  _props: LeadWorkspaceProps,
): React.JSX.Element {
  return (
    <EntityWorkspace
      activities={[]}
      notes={[]}
      tasks={[]}
      attachments={[]}
      notifications={[]}
    />
  );
}