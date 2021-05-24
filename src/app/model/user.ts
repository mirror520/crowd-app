export class User {
    private _username: string;
    private _password: string;
    private _isAdmin: boolean = false;

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

    public get isAdmin(): boolean {
        return this._isAdmin;
    }
    public set isAdmin(value: boolean) {
        this._isAdmin = value;
    }
}
