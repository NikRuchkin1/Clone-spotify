import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Track, TrackDocument } from './schemas/track.schema';
import { CommentDocument, Comment } from './schemas/comments.schema';
import { CreateTrackDto } from './dto/create-track.dto';

@Injectable()

export class TrackService {
    constructor(@InjectModel(Track.name) private TrackModel: Model<TrackDocument>,
        @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>) { }

    async create(dto: CreateTrackDto): Promise<Track> {
        const track = await this.TrackModel.create({ ...dto, listener: 0 })
        return track
    }

    async getAll(): Promise<Track[]> {
        const tracks = await this.TrackModel.find()
        return tracks
    }

    async getOne(id: ObjectId): Promise<Track> {
        const track = await this.TrackModel.findById(id)
        return track
    }

    async delete(id: ObjectId): Promise<Track> {
        const track = await this.TrackModel.findByIdAndDelete(id)
        return track._id
    }
}