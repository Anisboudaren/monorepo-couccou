
import prisma from "../utils/prisma.utils";

interface CreateUserInput {
  email: string;
  password: string;
  role: string;
  username: string;
  settings: {
    theme: string;
  };
}

export const createUser = async (data: CreateUserInput) => {
  const { email, password, role, username, settings } = data;

  if (!email || !password || !role || !username) {
    throw new Error("Missing required fields");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  console.log(existingUser);
  
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      password,
      role,
      username,
      settings,
    },
  });

  return newUser;
};
