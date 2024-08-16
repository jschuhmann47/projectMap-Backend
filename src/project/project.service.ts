import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserService } from '../user/user.service'
import { ProjectDto, UpdateParticipantDto } from './project.dto'
import { Project } from './project.schema'
import { escapeRegExp } from './utils/escape_string'
import { Stage } from './stage.schema'

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel('Project') private projectModel: Model<Project>,
        private userService: UserService
    ) {}

    async getOne(id: string) {
        return this.projectModel.findById(id) //.populate(['owner']).exec()
    }

    async getSharedUsers(projectId: string) {
        return this.userService.findUsersBySharedProject(projectId)
    }

    async create(newProject: ProjectDto) {
        return new this.projectModel(newProject).save()
    }

    async shareProject(id: string, userIds: string[]) {
        const project = await this.getOne(id)
        await Promise.all(
            userIds.map((userId) =>
                this.userService.assignProjects(userId, [project])
            )
        )
        return this.getSharedUsers(id)
    }

    async shareProjectByEmail(id: string, email: string) {
        const project = await this.getOne(id)
        const user = await this.userService.findUserByEmail(email)
        await this.userService.assignProjects(user._id.toString(), [project])
        return this.getSharedUsers(id)
    }

    async removeUserFromProjectByEmail(id: string, emails: string[]) {
        const users = await Promise.all(
            emails.map((email) => this.userService.findUserByEmail(email))
        )
        await Promise.all(
            users.map((user) =>
                this.userService.removeProjects(user._id.toString(), [id])
            )
        )
        return this.getSharedUsers(id)
    }

    async removeUserFromProject(id: string, userId: string) {
        await this.userService.removeProjects(userId, [id])
        return this.getSharedUsers(id)
    }

    // eslint-disable-next-line
    async findUserProjects(owner: string) {
        //return this.projectModel.find({ owner })
        return this.projectModel.find({})
    }

    async findProjectsByName(name: string) {
        return this.projectModel.find({
            name: new RegExp(escapeRegExp(name), 'i'),
        })
    }

    async findSharedProjects() {
        //const user = await this.userService.findById(userId)
        return [] // user.sharedProjects TODO: borrar
    }
    async update(id: string, updated: ProjectDto) {
        return this.projectModel.findOneAndUpdate({ _id: id }, updated)
    }

    async delete(id: string) {
        const users = await this.getSharedUsers(id)

        await Promise.all(
            users.map((user) =>
                this.userService.removeProjects(user._id.toString(), [id])
            )
        )
        const result = await this.projectModel.deleteOne({ _id: id })
        if (result.deletedCount) return id
        else throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }

    async updateParticipantRole(
        projectId: string,
        participantDto: UpdateParticipantDto[]
    ) {
        const project = await this.projectModel.findById(projectId)

        if (project) {
            participantDto.forEach((participantDto) => {
                const user = project.participants.find(
                    (participant) =>
                        participant.userEmail == participantDto.userEmail
                )

                if (user) {
                    user.stages = participantDto.stages
                } else {
                    project.participants.push({
                        userEmail: participantDto.userEmail,
                        stages: participantDto.stages,
                    })
                }
            })
        }

        return project.save()
    }

    async updateCoordinatorRole(projectId: string, userEmails: string[]) {
        const project = await this.projectModel.findById(projectId)

        if (project) {
            userEmails.forEach((userEmail) => {
                const matchedUser = project.coordinators.find(
                    (coordinator) => coordinator.email == userEmail
                )

                if (!matchedUser) {
                    project.coordinators.push({
                        email: userEmail,
                    })
                }
            })
        }

        return project.save()
    }

    async getUserStagePermission(
        projectId: string,
        userEmail: string,
        stageId: string
    ): Promise<Stage> {
        const project = await this.projectModel.findById(projectId)

        if (project) {
            const matchedUser = project.participants.find(
                (participant) => participant.userEmail == userEmail
            )

            if (matchedUser) {
                const stage = matchedUser.stages.find(
                    (stage) => stage.id == stageId
                )

                return stage
            }
        }
    }
}
