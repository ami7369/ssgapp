"use client";
import useSWR from "swr";
import { useState } from "react";

//確認用のスリープ
function sleep(msec) {
  return new Promise((resolve) => {
    setTimeout(resolve, msec);
  });
}

const fetcher = (url) =>
  fetch(url).then(async (res) => {
    sleep(9000);
    return res.json();
  });


const Home = () => {
  const { data, error, mutate} = useSWR(
    "https://jsonplaceholder.typicode.com/users",
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => mutate()}>Refresh posts</button>
      <ul>
        <li>item</li>
        {data.map((user) => (
          <li key={user.id}>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
