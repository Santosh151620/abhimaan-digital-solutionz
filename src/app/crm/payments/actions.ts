'use server';

import {
    PaymentsServiceInstance,
} from '@/services/crm/PaymentsService';

import {
    PermissionServiceInstance,
} from '@/services/crm/PermissionService';

import {
    CRM_ADMIN_ROLE,
} from '@/shared/crmPermissions';

import type {
    Payment,
    PaymentStatus,
} from '@/types/crm/Payments';

function can(
    action:
        | 'create'
        | 'update'
        | 'delete',
) {

    return PermissionServiceInstance.hasPermission(

        CRM_ADMIN_ROLE,

        'Payment',

        action,

    );

}

export async function getPayments() {

    return PaymentsServiceInstance.list();

}

export async function getArchivedPayments() {

    return PaymentsServiceInstance.listArchived();

}

export async function getPayment(
    id: string,
) {

    return PaymentsServiceInstance.details(
        id,
    );

}

export async function createPayment(
    data: Partial<Payment>,
) {

    if (
        !can('create')
    ) {

        throw new Error(
            'Permission denied',
        );

    }

    return PaymentsServiceInstance.create(
        data,
    );

}

export async function updatePayment(
    id: string,
    data: Partial<Payment>,
) {

    if (
        !can('update')
    ) {

        throw new Error(
            'Permission denied',
        );

    }

    return PaymentsServiceInstance.update(
        id,
        data,
    );

}

export async function deletePayment(
    id: string,
) {

    if (
        !can('delete')
    ) {

        throw new Error(
            'Permission denied',
        );

    }

    return PaymentsServiceInstance.delete(
        id,
    );

}

export async function restorePayment(
    id: string,
) {

    if (
        !can('update')
    ) {

        throw new Error(
            'Permission denied',
        );

    }

    return PaymentsServiceInstance.restore(
        id,
    );

}

export async function updatePaymentStatus(
    id: string,
    status: PaymentStatus,
) {

    if (
        !can('update')
    ) {

        throw new Error(
            'Permission denied',
        );

    }

    return PaymentsServiceInstance.updateStatus(
        id,
        status,
    );

}

export async function getPaymentsSummary() {

    return PaymentsServiceInstance.summary();

}