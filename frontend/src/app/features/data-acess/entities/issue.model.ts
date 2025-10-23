export interface Issue{
    id: number;
    title: string;
    project: string;
    user?: string | null;
    hours?: number | null;
    status?: string | null;
    blocked_time?: number | null;
    init_time?: string  | null;
    due_date?: string  | null;
    closed_date?: string  | null;
    
}