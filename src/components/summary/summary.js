import React, {useEffect, useState} from 'react';
import './summary.css';

//TODO: Here are rendered only selected articles and not subcategories

const Summary = (props) => {

  const [nestedArticlesList, setNestedArticlesList] = useState([]);
  const [summaryArticles, setSummaryArticles] = useState([]);

  useEffect(() => {
    setNestedArticlesList(props.location?.state[0]);
  }, []);

  useEffect(() => {
    let recursive = (givenArticlesList) => givenArticlesList &&
        givenArticlesList.map((item) => {
          if (item?.children?.length === 0 && item?.isChecked) {
            setSummaryArticles([...summaryArticles, item?.path]);
          }

          recursive(item.children);
        });

    recursive(nestedArticlesList);
  }, [nestedArticlesList]);

  return <div className="container">
    <p>Selected:</p>
    {summaryArticles.length ? summaryArticles.map((selectedArticle, idx) => {
      return <p key={idx}>{selectedArticle}</p>;
    }) : <p>No Selected Articles!</p>}
  </div>;
};

export default Summary;