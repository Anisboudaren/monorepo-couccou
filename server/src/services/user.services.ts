import prisma from "../utils/prisma.utils";
import bcrypt from "bcrypt";

interface CreateUserInput {
  email: string;
  password: string;
  role: string;
  username: string;
  settings?: {
    theme: string;
  };
}

interface UpdateUserInput {
  email?: string;
  password?: string;
  role?: string;
  username?: string;
  settings?: {
    theme: string;
  };
}

export const createUser = async (data: CreateUserInput) => {
  const { email, password, role, username, settings } = data;

  if (!email || !password || !role || !username) {
    throw new Error("Missing required fields");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      username,
      settings,
    },
  });

  return newUser;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      settings: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      settings: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUser = async (id: string, data: UpdateUserInput) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        settings: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedUser;
  } catch (error) {
    throw new Error("User not found or update failed");
  }
};

export const deleteUser = async (id: string) => {
  try {
    await prisma.user.delete({ where: { id } });
    return true;
  } catch (error) {
    throw new Error("User not found or delete failed");
  }
};

export const getUserAgents = async (userId: string) => {
  const agents = await prisma.agent.findMany({
      where: {
          userId: userId,
      },
  });
  return agents;
};