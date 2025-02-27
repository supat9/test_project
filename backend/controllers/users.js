const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const user = await prisma.users.create({
      data: {
        username,
        password,
        email,
      },
    });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get all users
const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get user by id
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: {
        user_id: Number(id),
      },
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, email } = req.body;
  try {
    const user = await prisma.users.update({
      where: {
        user_id: Number(id),
      },
      data: {
        username,
        password,
        email,
      },
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.users.delete({
      where: {
        user_id: Number(id),
      },
    });
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register , getUsers, getUserById, updateUser , deleteUser};
