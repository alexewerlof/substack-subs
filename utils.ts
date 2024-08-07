import * as dotenv from "https://deno.land/std@0.224.0/dotenv/mod.ts"

export async function fetchJson(url: URL, cookie?: string) {
    const headers = {}

    if (cookie) {
        headers['cookie'] = cookie
    }

    const response = await fetch(url, { headers })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
}

export async function getAll<T>(url: string, cookie: string): Promise<T[]> {
    const results: T[] = []
    let flag = true
    let offset = 0
    const limit = 10
    while(flag) {
        console.log(`GET ${limit} items from ${offset}...`)
        const u = new URL(url)
        u.searchParams.set('limit', limit.toString())
        u.searchParams.set('offset', offset.toString())
        const j = await fetchJson(u, cookie)
        for (const row of j.rows) {
            results.push(row)
        }
        offset += limit
        if (j.total < offset) {
            flag = false
        }
    }
    
    return results
}

export function getURL(path: string, base: string) {
    const ret = new URL(path, base)
    ret.searchParams.set('order_by', 'xp_signups')
    ret.searchParams.set('order_direction', 'desc')
    return ret.toString()
}

export function printTable(title: string, rows: any[]) {
    const dashCount = (100 - title.length) / 2
    const dashes = '-'.repeat(dashCount)
    console.log(`\n\n/${dashes} ${title} ${dashes}\\`)
    console.table(rows)
}

export async function loadConfig() {
    const params = await dotenv.load()
    return [params.DOMAIN, params.COOKIE];
}