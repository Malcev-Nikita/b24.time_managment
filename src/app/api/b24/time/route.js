import { buildReport, getCurrentUserId, PERIODS } from '@/lib/b24'

export async function GET(request) {
    try {
        const requested = request.nextUrl.searchParams.get('period')
        const period = PERIODS.includes(requested) ? requested : 'today'

        const userId = await getCurrentUserId()
        const report = await buildReport(userId, period)

        return Response.json(report)
    } catch (e) {
        return Response.json({ error: e.message }, { status: 502 })
    }
}
