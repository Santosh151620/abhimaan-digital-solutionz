'use client';

import {
    useMemo,
    useState,
} from 'react';

import type {
    Quotation,
    QuotationStatus,
} from '@/types/crm/Quotations';

import QuotationsFilters from './QuotationsFilters';

import QuotationsTable from './QuotationsTable';



interface Props {

    quotations: Quotation[];

}



export default function QuotationsDataTable({

    quotations,

}: Props) {


    const [
        search,
        setSearch,
    ] = useState('');



    const [
        status,
        setStatus,
    ] =
        useState<
            QuotationStatus | 'ALL'
        >(
            'ALL',
        );



    const filteredQuotations =
        useMemo(() => {


            const keyword =
                search
                    .trim()
                    .toLowerCase();



            return quotations.filter(
                (
                    quotation,
                ) => {


                    const matchesSearch =

                        keyword.length === 0

                        ||

                        quotation.title
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        quotation.customerName
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        quotation.quotationNumber
                            .toLowerCase()
                            .includes(keyword);



                    const matchesStatus =

                        status === 'ALL'

                        ||

                        quotation.status === status;



                    return (

                        matchesSearch

                        &&

                        matchesStatus

                    );


                },
            );


        }, [

            quotations,

            search,

            status,

        ]);



    return (

        <div className="space-y-4">


            <QuotationsFilters

                search={search}

                status={status}

                onSearchChange={
                    setSearch
                }

                onStatusChange={
                    setStatus
                }

            />



            <QuotationsTable

                quotations={
                    filteredQuotations
                }

            />


        </div>

    );

}
