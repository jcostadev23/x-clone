import { getUserById } from "@/utils/apiCalls";
import UserPage from "./UserPage";

type Props = {
  params: { userId: string };
};

const Page: React.FC<Props> = async ({ params }) => {
  const { userId } = await params;
  const user = await getUserById(userId);

  return (
    <div className="flex gap-2 justify-center align-middle text-3xl">
      {user.userName}
      <UserPage userId={userId} />
    </div>
  );
};

export default Page;
