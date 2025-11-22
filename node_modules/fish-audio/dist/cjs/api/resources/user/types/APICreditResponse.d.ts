export interface APICreditResponse {
    _id: string;
    user_id: string;
    credit: string;
    created_at: string;
    updated_at: string;
    has_phone_sha256: boolean;
    has_free_credit?: boolean;
}
