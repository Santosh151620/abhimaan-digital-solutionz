import type { Metadata } from 'next';

import { generateSEO } from '@/lib/seo';

import '@/app/globals.css';


export const metadata: Metadata = generateSEO({

    title:
        'About Abhimaan Digital Solutionz',

    description:
        'Learn about Abhimaan Digital Solutionz, our digital transformation approach, and our vision for connected business platforms, customer relationships and scalable digital experiences.',

    path:
        '/about',

});



const principles = [

    {
        title:
            'Customer Relationships First',

        description:
            'We build around the customer relationship, helping businesses organize leads, contacts, opportunities, activities and revenue intelligence in one connected experience.',
    },

    {
        title:
            'Modular by Design',

        description:
            'Businesses should be able to adopt the capabilities they need without being forced into an unnecessarily large platform. Our architecture is designed around independently enableable business modules.',
    },

    {
        title:
            'Built for Business Growth',

        description:
            'Our products are designed to support businesses as their teams, customers, workflows and operational requirements evolve.',
    },

    {
        title:
            'Connected Digital Experiences',

        description:
            'From public digital experiences to internal business systems, we focus on creating consistent, useful and scalable experiences across the customer journey.',
    },

];


const capabilities = [

    'Digital transformation',

    'Business websites and digital experiences',

    'Customer relationship management',

    'Lead and opportunity management',

    'Sales pipeline and revenue intelligence',

    'Workflow and business process support',

    'Business analytics and executive visibility',

    'Modular business platforms',

];


export default function AboutPage() {

    return (

        <main className="min-h-screen bg-slate-950 text-white">


            {/* Hero */}

            <section
                aria-labelledby="about-title"
                className="
                    border-b
                    border-white/10
                    bg-gradient-to-br
                    from-teal-500/[0.12]
                    via-slate-950
                    to-slate-900
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-6
                        py-20
                        sm:py-24
                        lg:px-8
                        lg:py-32
                    "
                >

                    <div className="max-w-4xl space-y-7">

                        <p
                            className="
                                text-sm
                                font-semibold
                                uppercase
                                tracking-[0.24em]
                                text-teal-400
                            "
                        >
                            Abhimaan Digital Solutionz
                        </p>


                        <h1
                            id="about-title"
                            className="
                                text-4xl
                                font-bold
                                tracking-tight
                                sm:text-5xl
                                lg:text-6xl
                            "
                        >
                            Building digital systems
                            <span className="text-teal-400">
                                {' '}around the way businesses grow.
                            </span>
                        </h1>


                        <p
                            className="
                                max-w-3xl
                                text-lg
                                leading-8
                                text-slate-300
                                sm:text-xl
                            "
                        >
                            Abhimaan Digital Solutionz creates modern
                            digital experiences and business platforms
                            designed to help organizations build stronger
                            customer relationships, improve visibility
                            and operate more effectively.
                        </p>

                    </div>

                </div>

            </section>



            {/* Introduction */}

            <section
                aria-labelledby="our-approach"
                className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24"
            >

                <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

                    <div>

                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-400">
                            Our Approach
                        </p>

                        <h2
                            id="our-approach"
                            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
                        >
                            Technology should simplify business,
                            not complicate it.
                        </h2>

                    </div>


                    <div className="space-y-5 text-base leading-8 text-slate-300">

                        <p>
                            Modern businesses operate across websites,
                            sales conversations, customer records,
                            workflows, reporting and increasingly
                            intelligent decision-support systems.
                        </p>

                        <p>
                            We believe these experiences should work
                            together rather than become disconnected
                            systems that teams have to manage separately.
                        </p>

                        <p>
                            Our work therefore focuses on practical,
                            scalable digital products that connect
                            customer-facing experiences with the business
                            processes behind them.
                        </p>

                    </div>

                </div>

            </section>



            {/* Principles */}

            <section
                aria-labelledby="principles-title"
                className="border-y border-white/10 bg-slate-900/60"
            >

                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">

                    <div className="max-w-3xl">

                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-400">
                            What We Believe
                        </p>

                        <h2
                            id="principles-title"
                            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
                        >
                            Principles behind our platform thinking.
                        </h2>

                    </div>


                    <div className="mt-12 grid gap-5 md:grid-cols-2">

                        {
                            principles.map((principle) => (

                                <article
                                    key={principle.title}
                                    className="
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-slate-950/70
                                        p-7
                                        transition
                                        hover:-translate-y-1
                                        hover:border-teal-400/30
                                    "
                                >

                                    <h3 className="text-xl font-semibold">
                                        {principle.title}
                                    </h3>

                                    <p className="mt-3 leading-7 text-slate-400">
                                        {principle.description}
                                    </p>

                                </article>

                            ))
                        }

                    </div>

                </div>

            </section>



            {/* Capabilities */}

            <section
                aria-labelledby="capabilities-title"
                className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24"
            >

                <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

                    <div>

                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-400">
                            Capabilities
                        </p>

                        <h2
                            id="capabilities-title"
                            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
                        >
                            A foundation for connected digital operations.
                        </h2>

                        <p className="mt-5 leading-7 text-slate-400">
                            Our capabilities span customer-facing digital
                            experiences and the systems that help businesses
                            manage relationships, sales and operational
                            visibility.
                        </p>

                    </div>


                    <div
                        className="
                            grid
                            gap-3
                            sm:grid-cols-2
                        "
                    >

                        {
                            capabilities.map((capability) => (

                                <div
                                    key={capability}
                                    className="
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        px-5
                                        py-4
                                        text-sm
                                        font-medium
                                        text-slate-200
                                    "
                                >
                                    {capability}
                                </div>

                            ))
                        }

                    </div>

                </div>

            </section>



            {/* Platform vision */}

            <section
                aria-labelledby="vision-title"
                className="
                    border-t
                    border-white/10
                    bg-gradient-to-r
                    from-teal-500/[0.08]
                    to-blue-500/[0.08]
                "
            >

                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">

                    <div className="max-w-4xl">

                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-400">
                            Our Vision
                        </p>

                        <h2
                            id="vision-title"
                            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
                        >
                            A more connected way to run customer-focused
                            businesses.
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-slate-300">
                            Our long-term direction is to create a flexible
                            business platform where organizations can adopt
                            individual capabilities as they need them,
                            while maintaining a consistent foundation for
                            customer relationships, business intelligence
                            and digital growth.
                        </p>

                    </div>

                </div>

            </section>



            {/* Closing */}

            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                <div
                    className="
                        rounded-3xl
                        border
                        border-teal-400/20
                        bg-teal-400/[0.06]
                        p-8
                        sm:p-10
                        lg:p-12
                    "
                >

                    <h2 className="text-2xl font-bold sm:text-3xl">
                        Digital transformation with a practical purpose.
                    </h2>

                    <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                        We focus on technology that helps businesses
                        understand their customers, make better decisions
                        and build sustainable digital capabilities.
                    </p>

                </div>

            </section>


        </main>

    );

}