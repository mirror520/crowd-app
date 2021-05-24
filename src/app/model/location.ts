export class Location {
    private _id: number;
    private _name: string;
    private _capacity: number;
    private _current: number;
    private _code: string;

    public crowd: any[];

    public updateFromTopic(attr: string, message: string) {
        console.log(`attr: ${attr}, message: ${message}`);
        switch (attr) {
            case 'name':
                this.name = message;
                break;
            case 'capacity':
                this.capacity = +message;
                break;
            case 'current':
                this.current = +message;
                break;
            case 'code':
                this.code = message;
                break;
        }
    }

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

        this.crowd = [{
            name: this.name,
            value: this._current
        }];
    }

    public get code(): string {
        return this._code;
    }
    public set code(value: string) {
        this._code = value;
    }
}
