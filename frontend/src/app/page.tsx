import { Tweet } from "./types";

export default async function Home() {
  const tweets: Array<Tweet> = await fetch("http://localhost:4000/tweets")
    .then((resp) => resp.json())
    .then((data) => data.data);

  return (
    <div className="container mx-auto mt-10">
      {tweets.map((tweet) => (
        <div className="bg-gray-400 p-3 m-2 rounded-2xl" key={tweet._id}>
          <div>Tweet: {tweet.description}</div>
          <div>Comments: {tweet.coments.map((coment) => coment.comment)}</div>
          <div>Likes: {tweet.likes.length}</div>
          <div>Date: {tweet.date}</div>
        </div>
      ))}
    </div>
  );
}
