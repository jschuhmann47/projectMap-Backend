import { ApiProperty } from '@nestjs/swagger';

export class ConsultoraDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  projects: string[];
}

export class ConsultantDto {
  @ApiProperty()
  email: string;
}

export class AssignProjectDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  projects: string[];
}
