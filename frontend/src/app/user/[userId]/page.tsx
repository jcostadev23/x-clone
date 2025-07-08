import FollowUsers from "@/components/FollowUsers";
import { getUserById } from "@/utils/apiCalls";

type Props = {
  params: { userId: string };
};

const UserPage: React.FC<Props> = async ({ params }) => {
  const { userId } = params;
  const user = await getUserById(userId);

  return (
    <div className="flex gap-2 justify-center align-middle text-3xl">
      {user.userName}
      <FollowUsers />
    </div>
  );
};

export default UserPage;
