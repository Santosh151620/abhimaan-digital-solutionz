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

    const total = active.length;

    const unread =
        active.filter(
            notification =>
                notification.status === 'Unread',
        ).length;

    const read =
        active.filter(
            notification =>
                notification.status === 'Read',
        ).length;

    const archived =
        notifications.filter(
            notification =>
                notification.archived,
        ).length;

    const highPriority =
        active.filter(
            notification =>
                notification.priority === 'High',
        ).length;

    const criticalPriority =
        active.filter(
            notification =>
                notification.priority === 'Critical',
        ).length;

    const cards = [

        {
            title: 'Total',
            value: total,
        },

        {
            title: 'Unread',
            value: unread,
        },

        {
            title: 'Read',
            value: read,
        },

        {
            title: 'Archived',
            value: archived,
        },

        {
            title: 'High Priority',
            value: highPriority,
        },

        {
            title: 'Critical Priority',
            value: criticalPriority,
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