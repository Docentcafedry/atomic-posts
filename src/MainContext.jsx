import { faker } from "@faker-js/faker";
import {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

const MainContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  const handleAddPost = useCallback(function (post) {
    setPosts((posts) => [post, ...posts]);
  }, []);

  const handleClearPosts = useCallback(function () {
    setPosts([]);
  }, []);

  const providerValues = useMemo(
    function () {
      return {
        posts: searchedPosts,
        onClearPosts: handleClearPosts,
        searchQuery: searchQuery,
        setSearchQuery: setSearchQuery,
        onAddPost: handleAddPost,
      };
    },
    [searchQuery, searchedPosts, handleAddPost, handleClearPosts]
  );

  return (
    <MainContext.Provider value={providerValues}>
      {children}
    </MainContext.Provider>
  );
}

function useInfo() {
  const info = useContext(MainContext);
  return info;
}

export { PostProvider, MainContext, useInfo };
