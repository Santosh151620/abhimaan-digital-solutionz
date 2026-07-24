export type ProductType =
    | 'Product'
    | 'Service'
    | 'Subscription'
    | 'Bundle'
    | 'Other';



export type ProductStatus =
    | 'Draft'
    | 'Active'
    | 'Inactive'
    | 'Archived';



export interface Product {


    id:string;


    organizationId?:string;


    productNumber:string;


    sku?:string;


    name:string;


    description?:string;


    type:ProductType;


    status:ProductStatus;


    unit?:string;


    price:number;


    cost?:number;


    taxRate?:number;


    category?:string;


    entityType?:string;


    entityId?:string;


    isDeleted:boolean;


    deletedAt:string | null;


    deletedBy:string | null;


    createdAt:string;


    updatedAt:string;


}



export interface ProductSummary {


    total:number;


    active:number;


    inactive:number;


    archived:number;


}
