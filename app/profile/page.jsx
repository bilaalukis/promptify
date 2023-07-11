"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/profile";

import React from "react";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [allPosts, setAllPosts] = useState([]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = allPosts.filter((p) => p._id !== post._id);

        setAllPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchPosts = async () => {
    const response = await fetch(`/api/users/${session?.user.id}/posts`);
    const data = await response.json();

    setAllPosts(data);
  };

  useEffect(() => {
    session?.user.id && fetchPosts();
  }, []);

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={allPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
