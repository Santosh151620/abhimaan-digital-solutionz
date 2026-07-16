'use server';

import {
    AssetsServiceInstance,
} from '@/services/crm/AssetsService';

import type {
    Asset,
    AssetStatus,
} from '@/types/crm/Assets';

export async function listAssets() {
    return AssetsServiceInstance.list();
}

export async function listArchivedAssets() {
    return AssetsServiceInstance.listArchived();
}

export async function getAsset(
    id: string
) {
    return AssetsServiceInstance.details(id);
}

export async function createAsset(
    data: Partial<Asset>
) {
    return AssetsServiceInstance.create(data);
}

export async function updateAsset(
    id: string,
    data: Partial<Asset>
) {
    return AssetsServiceInstance.update(
        id,
        data
    );
}

export async function deleteAsset(
    id: string
) {
    return AssetsServiceInstance.delete(id);
}

export async function restoreAsset(
    id: string
) {
    return AssetsServiceInstance.restore(id);
}

export async function updateAssetStatus(
    id: string,
    status: AssetStatus
) {
    return AssetsServiceInstance.updateStatus(
        id,
        status
    );
}

export async function assetsSummary() {
    return AssetsServiceInstance.summary();
}