import type {
    Notification,
} from '@/types/crm/Notifications';

interface Props {

    notifications: Notification[];

}

export default function NotificationSummary({

    notifications,

}: Props) {

    const active =
        notifications.filter(
            notification => !notification.archived,
        );

    const cards = [

        {
            title: 'Total',
            value: active.length,
        },

        {
            title: 'Unread',
            value:
                active.filter(
                    n => n.status === 'Unread',
                ).length,
        },

        {
            title: 'Read',
            value:
                active.filter(
                    n => n.status === 'Read',
                ).length,
        },

        {
            title: 'Archived',
            value:
                notifications.filter(
                    n => n.archived,
                ).length,
        },

        {
            title: 'High Priority',
            value:
                active.filter(
                    n => n.priority === 'High',
                ).length,
        },

        {
            title: 'Critical Priority',
            value:
                active.filter(
                    n => n.priority === 'Critical',
                ).length,
        },

    ];

    return (

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {cards.map(card => (

                <div
                    key={card.title}
                    className="crm-card p-5"
                >

                    <p className="text-sm text-slate-500">
                        {card.title}
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {card.value}
                    </p>

                </div>

            ))}

        </div>

    );

}