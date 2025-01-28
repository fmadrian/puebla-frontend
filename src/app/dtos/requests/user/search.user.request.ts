import { SearchRequest } from "../search.request";

export interface SearchUserRequest extends SearchRequest {
    q: string;
    isEnabled: boolean
};