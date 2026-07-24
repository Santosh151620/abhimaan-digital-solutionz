import type {
    ClientPortalSummary,
} from '@/types/crm/ClientPortal';



export default function ClientPortalSummary({
    summary,
}:{
    summary:ClientPortalSummary;
}){


    return (

        <div className="grid grid-cols-4 gap-4">


            <div className="border p-4 rounded">
                <p>Total</p>
                <strong>{summary.total}</strong>
            </div>


            <div className="border p-4 rounded">
                <p>Active</p>
                <strong>{summary.active}</strong>
            </div>


            <div className="border p-4 rounded">
                <p>Inactive</p>
                <strong>{summary.inactive}</strong>
            </div>


            <div className="border p-4 rounded">
                <p>Archived</p>
                <strong>{summary.archived}</strong>
            </div>


        </div>

    );

}
