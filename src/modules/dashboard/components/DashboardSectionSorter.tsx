"use client";

import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";

import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import SortableCollapsibleFrame from "@/components/ui/SortableCollapsibleFrame";



type SectionItem = {

    id: string;

    title: string;

    description?: string;

    content: ReactNode;

};




interface Props {

    sections: SectionItem[];

}




const STORAGE_KEY =
    "ads-dashboard-section-order";





function readStoredOrder(): string[] | null {


    if (
        typeof window === "undefined"
    ) {
        return null;
    }



    try {


        const value =
            window.localStorage.getItem(
                STORAGE_KEY,
            );



        if (!value) {
            return null;
        }



        const parsed =
            JSON.parse(value);



        return Array.isArray(parsed)
            ? parsed
            : null;



    } catch {


        window.localStorage.removeItem(
            STORAGE_KEY,
        );


        return null;


    }


}





function saveStoredOrder(
    items: SectionItem[],
) {


    if (
        typeof window === "undefined"
    ) {
        return;
    }



    window.localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(

            items.map(
                (item)=>
                    item.id,
            ),

        ),

    );


}





function SortableSection({

    section,

}:{

    section: SectionItem;

}) {



    const {

        attributes,

        listeners,

        setNodeRef,

        transform,

        transition,

    } =
        useSortable({

            id: section.id,

        });





    const style = {


        transform:
            CSS.Transform.toString(
                transform,
            ),


        transition,


        zIndex:
            transform
                ? 50
                : undefined,


    };





    return (


        <div

            ref={setNodeRef}

            style={style}

            className="
                transition-all
                duration-200
            "

        >



            <SortableCollapsibleFrame


                id={
                    section.id
                }


                title={
                    section.title
                }


                description={
                    section.description
                }


                dragHandleProps={{

                    ...attributes,

                    ...listeners,

                }}


            >


                {section.content}



            </SortableCollapsibleFrame>



        </div>


    );


}





export default function DashboardSectionSorter({

    sections,

}:Props) {



    const [

        items,

        setItems,

    ] =
        useState<SectionItem[]>(

            sections,

        );






    useEffect(()=>{


        const savedOrder =
            readStoredOrder();




        if (!savedOrder) {

            setItems(
                sections,
            );

            return;

        }





        const reordered =

            savedOrder

                .map(

                    (id)=>

                        sections.find(

                            (section)=>

                                section.id === id,

                        ),

                )

                .filter(

                    (
                        section,
                    ): section is SectionItem =>

                        Boolean(section),

                );





        const missingSections =

            sections.filter(

                (section)=>

                    !savedOrder.includes(
                        section.id,
                    ),

            );





        setItems([

            ...reordered,

            ...missingSections,

        ]);




    },[sections]);







    const sensors =

        useSensors(


            useSensor(

                PointerSensor,

                {

                    activationConstraint:{

                        distance:5,

                    },

                },

            ),




            useSensor(

                KeyboardSensor,

                {

                    coordinateGetter:

                        sortableKeyboardCoordinates,

                },

            ),


        );







    function handleDragEnd(

        event: DragEndEvent,

    ) {



        const {

            active,

            over,

        } = event;





        if (

            !over ||

            active.id === over.id

        ) {

            return;

        }





        setItems((current)=>{


            const oldIndex =

                current.findIndex(

                    (item)=>

                        item.id === active.id,

                );




            const newIndex =

                current.findIndex(

                    (item)=>

                        item.id === over.id,

                );





            if (

                oldIndex === -1 ||

                newIndex === -1

            ) {

                return current;

            }





            const updated =

                arrayMove(

                    current,

                    oldIndex,

                    newIndex,

                );





            saveStoredOrder(
                updated,
            );





            return updated;



        });


    }






    return (


        <DndContext


            sensors={sensors}


            collisionDetection={
                closestCenter
            }


            onDragEnd={
                handleDragEnd
            }


        >



            <SortableContext


                items={

                    items.map(

                        (item)=>

                            item.id,

                    )

                }



                strategy={

                    verticalListSortingStrategy

                }


            >



                <div

                    className="
                        space-y-5
                    "

                >



                    {items.map(

                        (section)=>(


                            <SortableSection


                                key={
                                    section.id
                                }


                                section={
                                    section
                                }


                            />


                        ),

                    )}



                </div>



            </SortableContext>



        </DndContext>


    );


}