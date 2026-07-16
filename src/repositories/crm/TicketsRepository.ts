import type { Ticket } from '@/types/crm/Tickets';


class TicketsRepository {


    private tickets:Ticket[]=[];


    async list(){

        return this.tickets.filter(
            ticket=>!ticket.archived
        );

    }


    async listArchived(){

        return this.tickets.filter(
            ticket=>ticket.archived
        );

    }



    async findById(
        id:string
    ){

        return (
            this.tickets.find(
                ticket=>ticket.id===id
            ) ?? null
        );

    }



    async create(
        data:Partial<Ticket>
    ){


        const ticket:Ticket={

            id:crypto.randomUUID(),

            ticketNumber:
                data.ticketNumber ??
                `TKT-${Date.now()}`,

            subject:
                data.subject ?? '',

            status:
                data.status ?? 'Open',

            priority:
                data.priority ?? 'Medium',

            archived:false,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString(),

            companyId:data.companyId,

            contactId:data.contactId,

            description:data.description,

            assignedTo:data.assignedTo,

            category:data.category,

            resolution:data.resolution,

        };


        this.tickets.push(ticket);


        return ticket;

    }



    async update(
        id:string,
        data:Partial<Ticket>
    ){

        const ticket =
            await this.findById(id);


        if(!ticket)
            throw new Error(
                'Ticket not found'
            );


        Object.assign(
            ticket,
            data,
            {
                updatedAt:
                new Date().toISOString()
            }
        );


        return ticket;

    }


}


export const TicketsRepositoryInstance =
    new TicketsRepository();