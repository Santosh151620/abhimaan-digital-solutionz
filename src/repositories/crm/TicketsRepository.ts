import type {
    Ticket,
    TicketStatus,
    TicketSummary,
} from '@/types/crm/Tickets';

class TicketsRepository {

    private tickets = new Map<string, Ticket>();

    list() {
        return Array.from(
            this.tickets.values(),
        ).filter(
            ticket => !ticket.archived,
        );
    }

    listArchived() {
        return Array.from(
            this.tickets.values(),
        ).filter(
            ticket => ticket.archived,
        );
    }

    details(
        id: string,
    ) {
        return this.tickets.get(id) ?? null;
    }

    findById(
        id: string,
    ) {
        return this.details(id);
    }

    create(
        data: Partial<Ticket>,
    ) {

        const now =
            new Date().toISOString();

        const ticket: Ticket = {

            id:
                crypto.randomUUID(),

            ticketNumber:
                data.ticketNumber ??
                `TKT-${Date.now()}`,

            companyId:
                data.companyId,

            contactId:
                data.contactId,

            subject:
                data.subject ?? '',

            description:
                data.description,

            status:
                data.status ?? 'Open',

            priority:
                data.priority ?? 'Medium',

            assignedTo:
                data.assignedTo,

            category:
                data.category,

            resolution:
                data.resolution,

            archived:
                false,

            createdAt:
                now,

            updatedAt:
                now,

        };

        this.tickets.set(
            ticket.id,
            ticket,
        );

        return ticket;

    }

    update(
        id: string,
        data: Partial<Ticket>,
    ) {

        const existing =
            this.tickets.get(id);

        if (!existing) {
            return null;
        }

        const updated: Ticket = {

            ...existing,

            ...data,

            updatedAt:
                new Date().toISOString(),

        };

        this.tickets.set(
            id,
            updated,
        );

        return updated;

    }

    updateStatus(
        id: string,
        status: TicketStatus,
    ) {
        return this.update(
            id,
            {
                status,
            },
        );
    }

    delete(
        id: string,
    ) {

        const existing =
            this.tickets.get(id);

        if (!existing) {
            return false;
        }

        existing.archived = true;

        existing.updatedAt =
            new Date().toISOString();

        this.tickets.set(
            id,
            existing,
        );

        return true;

    }

    restore(
        id: string,
    ) {

        const existing =
            this.tickets.get(id);

        if (!existing) {
            return false;
        }

        existing.archived = false;

        existing.updatedAt =
            new Date().toISOString();

        this.tickets.set(
            id,
            existing,
        );

        return true;

    }

    search(
        filters?: {

            status?: TicketStatus;

            priority?: Ticket['priority'];

            search?: string;

        },
    ) {

        let tickets =
            this.list();

        if (
            filters?.status
        ) {

            tickets =
                tickets.filter(
                    ticket =>
                        ticket.status ===
                        filters.status,
                );

        }

        if (
            filters?.priority
        ) {

            tickets =
                tickets.filter(
                    ticket =>
                        ticket.priority ===
                        filters.priority,
                );

        }

        if (
            filters?.search
        ) {

            const keyword =
                filters.search.toLowerCase();

            tickets =
                tickets.filter(
                    ticket =>

                        ticket.subject
                            .toLowerCase()
                            .includes(
                                keyword,
                            )

                        ||

                        (
                            ticket.description
                                ?.toLowerCase()
                                .includes(
                                    keyword,
                                )
                        ),
                );

        }

        return tickets;

    }

    summary(): TicketSummary {

        const tickets =
            this.list();

        return {

            total:
                tickets.length,

            open:
                tickets.filter(
                    ticket =>
                        ticket.status ===
                        'Open',
                ).length,

            inProgress:
                tickets.filter(
                    ticket =>
                        ticket.status ===
                        'In Progress',
                ).length,

            resolved:
                tickets.filter(
                    ticket =>
                        ticket.status ===
                        'Resolved',
                ).length,

            closed:
                tickets.filter(
                    ticket =>
                        ticket.status ===
                        'Closed',
                ).length,

            critical:
                tickets.filter(
                    ticket =>
                        ticket.priority ===
                        'Critical',
                ).length,

        };

    }

}

export const
    TicketsRepositoryInstance =
        new TicketsRepository();