import { NextResponse } from 'next/server';

import { PipelineServiceInstance } from '@/services/crm/PipelineService';

export async function GET() {

    const data =
        await PipelineServiceInstance.list();

    return NextResponse.json(data);

}




