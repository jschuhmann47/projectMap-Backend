export interface Spheres {
  id: string;
  permission: "read" | "write" | "view";
}

export interface Participant {
  userId: string;
  spheres: Spheres[];
}

export interface Project {
  id: string;
  name: string;
  coordinators: string[];
  participants: Participant[];
}