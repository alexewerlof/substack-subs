import { getAll, getURL, loadConfig, printTable } from "./utils.ts"
import { MergedSummary, SubstackResponseRow, Summary } from "./json-shape.ts"

async function main() {
    const [ domain, cookie ] = await loadConfig();

    console.log('Getting publications recommending you...');
    const otherRows = await getAll<SubstackResponseRow>(getURL("/api/v1/recommendations/stats/to", domain), cookie);
    const otherRowsSummary: Summary[] = [];
    for (const other of otherRows) {
        otherRowsSummary.push({
            base_url: other.source_pub.base_url,
            author_name: other.source_pub.author_name,
            xp_signups: other.xp_signups,
            xp_paid_subs: other.xp_paid_subs,
            is_active: other.is_active,
            is_mutual: other.is_mutual,
            //source_pub_email_from_name: y.source_pub.email_from_name,
            freeSubscriberCount: other.source_pub.freeSubscriberCount,
        });
    }

    printTable('Others', otherRowsSummary);

    console.log('Getting publications you recommend...');
    const youRows = await getAll<SubstackResponseRow>(getURL("/api/v1/recommendations/stats/from", domain), cookie);
    const youRowsSummary: Summary[] = [];
    for (const you of youRows) {
        youRowsSummary.push({
            base_url: you.target_pub.base_url,
            author_name: you.target_pub.author_name,
            xp_signups: you.xp_signups,
            xp_paid_subs: you.xp_paid_subs,
            is_active: you.is_active,
            is_mutual: you.is_mutual,
            //target_pub_email_from_name: y.target_pub.email_from_name,
            freeSubscriberCount: you.target_pub.freeSubscriberCount,
        });
    }

    printTable('Yours', youRowsSummary);

    const merged: MergedSummary[] = [];
    for (const o of otherRowsSummary) {
        merged.push({
            base_url: o.base_url,
            author_name: o.author_name,
            sent_free: o.xp_signups ?? 0,
            received_free: 0,
            sent_paid: o.xp_paid_subs ?? 0,
            received_paid: 0,
            is_active: o.is_active,
            is_mutual: o.is_mutual,
            freeSubscriberCount: o.freeSubscriberCount,
            diff_free: 0,
            diff_paid: 0,
        });
    }

    for (const y of youRowsSummary) {
        const found = merged.find(x => x.base_url === y.base_url);
        if (found) {
            found.received_free = y.xp_signups ?? 0;
            found.received_paid = y.xp_paid_subs ?? 0;
        } else {
            merged.push({
                base_url: y.base_url,
                author_name: y.author_name,
                sent_free: 0,
                received_free: y.xp_signups ?? 0,
                sent_paid: 0,
                received_paid: y.xp_paid_subs ?? 0,
                is_active: y.is_active,
                is_mutual: y.is_mutual,
                freeSubscriberCount: y.freeSubscriberCount,
                diff_free: 0,
                diff_paid: 0,
            });
        }
    }

    for (const m of merged) {
        m.diff_free = m.sent_free - m.received_free;
        m.diff_paid = m.sent_paid - m.received_paid;
    }

    printTable('Merged', merged)
}

try {
    await main();
} catch (e) {
    console.error(e);
}