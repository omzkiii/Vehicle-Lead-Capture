import { insertUser, type UserData } from "./utils.js";

type FileData = {
  content: string;
  [key: string]: any;
};

type ResponseData = {
  files: Record<string, FileData>;
};

async function getGistFile(
  gistId: string,
  filename: string,
): Promise<UserData[] | null> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      Accept: "application/vnd.github.raw",
    },
  });

  const data: ResponseData = await res.json();
  const file = data.files[filename];

  if (!file?.content) return null;

  const parsed: UserData[] = JSON.parse(file.content);

  return parsed;
}

export async function seed() {
  const data =
    (await getGistFile("3691a622ba446e4e39d0e80ece702a44", "leads.json").catch(
      console.error,
    )) ?? [];
  data.map(async (d) => {
    try {
      await insertUser(d);
    } catch (error) {
      console.log(`Error seeding or DB is already populated`);
    }
  });
}
