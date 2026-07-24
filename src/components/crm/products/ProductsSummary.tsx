import type {
    ProductSummary,
} from '@/types/crm/Products';



export default function ProductsSummary({
    summary,
}:{
    summary:ProductSummary;
}){


    return (

        <div className="grid grid-cols-4 gap-4">


            <div className="rounded border p-4">
                <p>Total</p>
                <strong>{summary.total}</strong>
            </div>


            <div className="rounded border p-4">
                <p>Active</p>
                <strong>{summary.active}</strong>
            </div>


            <div className="rounded border p-4">
                <p>Inactive</p>
                <strong>{summary.inactive}</strong>
            </div>


            <div className="rounded border p-4">
                <p>Archived</p>
                <strong>{summary.archived}</strong>
            </div>


        </div>

    );

}
