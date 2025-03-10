import { PartialType } from "@nestjs/mapped-types"
import { CreateMovieDto } from "./create-movie.dto"



export class UpdateMovieDto {
    title?: string;
    releaseDate?: string;
}
