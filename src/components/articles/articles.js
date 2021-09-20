import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './articles.css';

/*
   TODO: In this case I think that to avoid multiple mapping this methods should be created on the server side,
*/

const Articles = () => {

  const history = useHistory();

  const [ articles, setArticles ] = useState([]);
  const [ nestedArticlesList ,setNestedArticlesList ] = useState([]);
  const [ selectedArticles, setSelectedArticles ] = useState('')

  useEffect(() => {
    fetch('https://frakton.dev/articles.php')
        .then((response) => response.json())
        .then((response) => setArticles(response))
  }, [])

  useEffect(() => {
      convertToRecursive(articles)
  }, [articles])

  useEffect(() => {
    console.log(selectedArticles)
  }, [selectedArticles])

  const findArticlesChildren = (parentId, givenPath) => {
    let array = [];
    articles.map(article => {
      let createPath = givenPath;
      if(article.parent === parentId) {
        createPath+=`/${article.name}`;
        array.push({...article, isChecked: false, path: createPath});
      }
    });
    return array;
  }

  const convertToRecursive = () => {
    let newNestedArticlesList = [];
    articles && articles.map(article => {
        article.parent === 0 && newNestedArticlesList.push({
          ...article,
          isChecked: false,
          path: `/${article.name}`,
        })
    });
    let createPath = '';
    const recursive = (givenArray, isChildren) => {
      // if(!isChildren) {
      //   createPath = '';
      // }
      givenArray.map(article => {
        if(!isChildren) {
          createPath = `${article.path}`;
        } else {
          createPath+=`/${article.name}`;
        }
        article.children = findArticlesChildren(article.id, createPath);
        recursive(article.children, true)
      })
    };
    recursive(newNestedArticlesList);
    console.log(newNestedArticlesList)
    setNestedArticlesList(newNestedArticlesList);
  }

  // TODO: In this function I made one more recursive function to uncheck all nested children when parent is unchecked
  const selectRequiredArticle = (articleId) => {
    let oldNestedArticlesList = [...nestedArticlesList];
    let recursive = (givenNestedArticlesList, isChildren) => givenNestedArticlesList.map(article => {
      if(article.id === articleId) {
        setSelectedArticles(selectedArticles.concat(`/${article.name}`))
        article.isChecked = !article.isChecked;
        recursive(article.children, true)
      } else {
        if(isChildren) {
          article.isChecked = false;
        }
        if(!article.children) {
          console.log(article, 'nuk ka ma posht shqipe')
        }
        recursive(article.children);
      }
    })
    recursive(oldNestedArticlesList);

    setNestedArticlesList(oldNestedArticlesList)
  }

  const renderArticlesNestedList = (givenNestedArticlesList, isChecked) => {
    return isChecked && <div className="article">
      {givenNestedArticlesList && React.Children.toArray(givenNestedArticlesList.map(article => <>
        <div className="article__item"
             onClick={() => selectRequiredArticle(article.id)}>
            <div className={`checkbox ${article.isChecked && 'checkbox--checked'}`} />
            <p>{article.name}</p>
          </div>
          {renderArticlesNestedList(article.children, article.isChecked)}
        </>
      ))}
    </div>
  }

  const navigateToSummaryDetails = () => {
    history.push('/summary')
  }

  return <>
    <div className="container">
      {renderArticlesNestedList(nestedArticlesList, true)}
      <div className="summary">
        <button onClick={() => navigateToSummaryDetails()}
              className="summary__button"
        >Summary</button>
      </div>
    </div>
  </>
}

export default Articles;