import { Module } from "@nestjs/common";
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackSchema, Track } from './schemas/track.schema';
import { CommentSchema, Comment } from './schemas/comments.schema';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])
    ],
    controllers: [TrackController],
    providers: [TrackService]
})

export class TrackModule { }