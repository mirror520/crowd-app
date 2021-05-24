export class User {
    private _username: string;
    private _password: string;
    private _role: UserRole;

    public get username(): string {
        return this._username;
    }
    public set username(value: string) {
        this._username = value;
    }

    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }

    public get role(): UserRole {
        return this._role;
    }
    public set role(value: UserRole) {
        this._role = value;
    }
}

export enum UserRole {
    Admin = 'admin',
    User = 'user'
}
