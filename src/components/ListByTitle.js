import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ListByTitle = () => {
  const { title } = useParams();
  console.log(title);
  const [articleList, setArticleList] = useState([]);

  useEffect(() => {
    const fetchArticlesByTitle = async () => {
      try {
        const response = await fetch(
          `https://react-blog-pxkwa4oc8-willas-projects-8b6efd89.vercel.app/listByTitle/${title}`
        );
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setArticleList(data);
      } catch (error) {
        console.error("Error fetching articles by title:", error);
      }
    };

    fetchArticlesByTitle();
  }, [title]);

  return (
    <div
      style={{ marginTop: "100px", marginLeft: "50px", textAlign: "center" }}
    >
      <h3>{`Articles related to ${title}`}</h3>
      {articleList.length > 0 ? (
        <ul>
          {articleList.map((article) => (
            <li key={article.id}>
              <Link to={`/showArticle/${article.title}`}>{article.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No articles found for the title.</p>
      )}
    </div>
  );
};

export default ListByTitle;
