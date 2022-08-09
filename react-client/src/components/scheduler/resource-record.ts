export class ResourceRecord {
    public readonly id: string;
    public readonly text: string;
    public readonly color: string;

    constructor(id: string, text: string, color: string) {
        this.id = id;
        this.text = text;
        this.color = color;
    }
}
