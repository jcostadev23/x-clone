import { getUserById } from "@/utils/apiCalls";

type Props = {
  params: { userId: number };
};

const UserPage: React.FC<Props> = async ({ params }) => {
  const { userId } = params;
  const user = await getUserById(userId);

  return (
    <div className="flex justify-center align-middle text-3xl">
      {user.userName}
    </div>
  );
};

export default UserPage;
