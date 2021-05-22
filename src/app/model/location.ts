export class Location {
    private _id: number;
    private _name: string;
    private _capacity: number;
    private _current: number;

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get capacity(): number {
        return this._capacity;
    }
    public set capacity(value: number) {
        this._capacity = value;
    }

    public get current(): number {
        return this._current;
    }
    public set current(value: number) {
        this._current = value;
    }
}
