import { Controller, Get } from "@nestjs/common";

@Controller('')
export class AppController {
    constructor() {}

    @Get('/')
    default() {
        return 'Welcome from group-chat'
    }
}
