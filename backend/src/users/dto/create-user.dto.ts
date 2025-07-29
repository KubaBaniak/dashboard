enum UserRoles {
  "ADMIN",
  "USER",
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role: UserRoles;
}
