export type AssetStatus =
    | 'Available'
    | 'Allocated'
    | 'Maintenance'
    | 'Retired';

export type AssetCategory =
    | 'Laptop'
    | 'Desktop'
    | 'Server'
    | 'Network'
    | 'Mobile'
    | 'Printer'
    | 'Furniture'
    | 'Vehicle'
    | 'Software'
    | 'License'
    | 'Other';

export interface Asset {

    id: string;

    assetCode: string;

    name: string;

    category?: AssetCategory;

    serialNumber?: string;

    model?: string;

    manufacturer?: string;

    assignedTo?: string;

    companyId?: string;

    department?: string;

    location?: string;

    purchaseDate?: string;

    warrantyExpiry?: string;

    purchaseCost: number;

    currentValue: number;

    status: AssetStatus;

    notes?: string;

    archived: boolean;

    createdAt: string;

    updatedAt: string;

}

export interface AssetSummary {

    total: number;

    available: number;

    allocated: number;

    maintenance: number;

    retired: number;

    archived: number;

    totalValue: number;

}