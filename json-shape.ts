interface Publication {
    base_url: string
    author_name: string
    freeSubscriberCount: number
}

export interface SubstackResponseRow {
    source_pub: Publication
    target_pub: Publication
    xp_signups: number
    xp_paid_subs: number
    is_active: boolean
    is_mutual: boolean
}

export interface Summary {
    base_url: string
    author_name: string
    xp_signups?: number
    xp_paid_subs?: number
    is_active: boolean
    is_mutual: boolean
    freeSubscriberCount: number
}

export interface MergedSummary extends Summary {
    sent_free: number
    received_free: number
    sent_paid: number
    received_paid: number
    diff_free: number
    diff_paid: number
}