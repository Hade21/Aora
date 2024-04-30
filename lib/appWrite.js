import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
} from "react-native-appwrite";

export const appWriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.hade21.aora",
  projectId: "6624acbe7ef51a1d585b",
  databaseId: "6624aeec1432dc9741a9",
  usersCollectionId: "6624af3bb48bf2de0c45",
  videoCollectionId: "6624af667a831883dbb9",
  storageId: "6624b234930467b160ca",
};

const client = new Client();

client
  .setEndpoint(appWriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appWriteConfig.projectId) // Your project ID
  .setPlatform(appWriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async ({ email, password, username }) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn({ email, password });

    const newUser = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionId,
      ID.unique(),
      {
        accountID: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export async function signIn({ email, password }) {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionId,
      [Query.equal("accountID", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async () => {
  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.videoCollectionId
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPost = async () => {
  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
