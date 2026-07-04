import { b24 } from '@/lib/b24'

export async function GET() {
    try {
        return Response.json(await b24('profile'))
    } catch (e) {
        return Response.json({ error: e.message }, { status: 502 })
    }
}
