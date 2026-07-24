import type {
    Opportunity,
} from '@/types/crm/Opportunities';



export default function OpportunitiesTable(
    {
        opportunities
    }:{
        opportunities:Opportunity[]
    }

){

    return (

        <table className="w-full">

            <tbody>

            {
                opportunities.map(
                    item=>(

                        <tr key={item.id}>

                            <td>
                                {item.name}
                            </td>

                            <td>
                                {item.stage}
                            </td>

                        </tr>

                    )
                )
            }

            </tbody>

        </table>

    );

}
