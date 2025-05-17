export class NotFoundException extends Error {
    constructor(message: string = "찾을 수 없습니다.") {
        super(message);
        this.name = "NotFoundException";
    }
}
