import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/user/user.schema'
import { Participant } from './participant.schema'
import mongoose from 'mongoose'
import { Stage } from './stage.schema'

export class ProjectDto {
    @ApiProperty()
    requestorId: string

    @ApiProperty()
    titulo: string

    @ApiProperty()
    descripcion: string

    @ApiProperty()
    color: string
}

export class Node {
    @ApiProperty()
    id: string;

    @ApiProperty()
    height: number;
  
    @ApiProperty()
    width: string;
  
    @ApiProperty()
    type: string;
  
    @ApiProperty()
    data: {
      label: string
    }
  
    @ApiProperty()
    source: string;
}

export class Edge {
    @ApiProperty()
    id: string;

    @ApiProperty()
    source: string
    
    @ApiProperty()
    target: string  
}

export class ChartDto {
    @ApiProperty()
    nodes: Node[];

    @ApiProperty()
    edges: Edge[];
}

export class ShareProjectDto {
    @ApiProperty()
    users: string[]
}

export class ShareProjectEmailDto {
    @ApiProperty()
    email: string
}

export class StopSharingProjectEmailDto {
    @ApiProperty()
    emails: string[]
}

export class UpdateUserRolesDto {
    @ApiProperty()
    users: UpdateUserRolesData[]
}

export class UpdateUserRolesData {
    @ApiProperty()
    userId: string

    @ApiProperty()
    role: string

    // Only if participant
    @ApiProperty()
    stages: Stage[]
}

export function toParticipant(u: UpdateUserRolesData) {
    const p = new Participant()
    p.user = new User()
    p.user._id = new mongoose.mongo.ObjectId(u.userId)
    p.stages = u.stages
    return p
}
