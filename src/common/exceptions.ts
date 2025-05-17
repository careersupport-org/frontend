export class NotFoundException extends Error {
    constructor(message: string = "찾을 수 없습니다.") {
        super(message);
        this.name = "NotFoundException";
    }
}

export class UnauthorizedException extends Error {
    constructor(message: string = "권한이 없습니다.") {
        super(message);
        this.name = "UnauthorizedException";
    }
}

export class ForbiddenException extends Error {
    constructor(message: string = "금지된 요청입니다.") {
        super(message);
        this.name = "ForbiddenException";
    }
}

export class BadRequestException extends Error {
    constructor(message: string = "잘못된 요청입니다.") {
        super(message);
        this.name = "BadRequestException";
    }
}

