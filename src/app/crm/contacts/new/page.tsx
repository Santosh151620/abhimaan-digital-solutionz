'use client';
import CRMPageLayout from "@/components/crm/shared/layout/CRMPageLayout";
import { useRouter } from 'next/navigation';

import PageHeader from '@/components/crm/ui/PageHeader';
import { ContactsForm } from '@/components/crm/contacts';

import { createContact } from '../actions';

export default function NewContactPage() {
  const router = useRouter();

  return (
    <CRMPageLayout>
      <PageHeader
        title="New Contact"
        description="Create a new contact for your CRM."
      />

      <ContactsForm
        onSubmit={async (values) => {
          await createContact(values);
          router.push('/crm/contacts');
          router.refresh();
        }}
        onCancel={() => router.push('/crm/contacts')}
      />
    </CRMPageLayout>
  );
}