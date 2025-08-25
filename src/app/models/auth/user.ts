export interface User {
    data: string;
    user(user: any): string;
    role: string;
    token: string;
    id: string;
    name: string;
    email: string;
    password: string;
}
