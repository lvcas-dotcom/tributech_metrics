export interface Issue{
    id: number;
    title: string;
    project: string;
    hours: number | null;
    label: string | null;
    date: string  | null;
}