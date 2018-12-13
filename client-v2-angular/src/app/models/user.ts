export class User {
    id: number;
    name: string;
    email?: string;
    // password: string;
    avatar?: string;
    token?: string;
    // for Ui
    isConnecting: boolean;
    isConnected: boolean;
}
