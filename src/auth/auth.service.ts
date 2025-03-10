import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { PrismaService } from "../prisma/prisma.service"
import * as bcrypt from "bcrypt"
import { UsersService } from "../users/users.service"

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private usersService: UsersService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } })

        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user
            return result
        }

        return null
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password)

        if (!user) {
            throw new UnauthorizedException("Invalid credentials")
        }

        const payload = { email: user.email, sub: user.id }

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        }
    }
}
