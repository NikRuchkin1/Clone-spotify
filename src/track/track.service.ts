import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Track, TrackDocument } from './schemas/track.schema';
import { CommentDocument, Comment } from './schemas/comments.schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-commet.dto';
import { FileService, FileType } from '../file/file.service';

@Injectable()

export class TrackService {
    constructor(@InjectModel(Track.name) private TrackModel: Model<TrackDocument>,
        @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
        private fileService: FileService) { }

    async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
        const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
        const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
        const track = await this.TrackModel.create({ ...dto, listens: 0, audio: audioPath, picture: picturePath })
        return track;
    }


    async getAll(count = 10, offset = 0): Promise<Track[]> {
        const tracks = await this.TrackModel.find().skip(Number(offset)).limit(Number(count))
        return tracks
    }

    async getOne(id: ObjectId): Promise<Track> {
        const track = await this.TrackModel.findById(id).populate('comments')
        return track
    }

    async delete(id: ObjectId): Promise<Track> {
        const track = await this.TrackModel.findByIdAndDelete(id)
        return track._id
    }

    async addComment(dto: CreateCommentDto): Promise<Comment> {
        const track = await this.TrackModel.findById(dto.trackId)
        const comment = await this.CommentModel.create({ ...dto })
        track.comments.push(comment._id)
        await track.save()
        return comment;
    }

    async listen(id: ObjectId) {
        const track = await this.TrackModel.findById(id)
        track.listens += 1
        track.save()
    }

    async search(query: string): Promise<Track[]> {
        const tracks = await this.TrackModel.find({
            name: { $regex: new RegExp(query, 'i') }
        })
        return tracks
    }
}