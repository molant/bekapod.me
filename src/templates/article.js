/* eslint-disable react/prefer-stateless-function */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Markdown from "react-markdown";
import { pathOr } from "ramda";
import routes from "../routes";
import PageContent from "../components/PageContent";
import PostDate from "../components/PostDate";
import Code from "../components/Code";
import Comments from "../components/Comments";
import JumpLinkWrapper from "../components/JumpLinkWrapper";
import JumpLink from "../components/JumpLink";

export default class extends Component {
  static propTypes = {
    data: PropTypes.shape({
      current: PropTypes.shape.isRequired,
      next: PropTypes.shape,
      prev: PropTypes.shape
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string
    }).isRequired
  };

  render() {
    const { location } = this.props;
    const { current: article, next, prev } = this.props.data;

    return (
      <PageContent>
        <h1>{article.title}</h1>
        <PostDate date={article.createdAt} />
        <Markdown
          source={pathOr("", ["content", "content"])(article)}
          renderers={{
            code: Code
          }}
        />

        <JumpLinkWrapper>
          {prev && (
            <JumpLink
              prev
              title={prev.title}
              url={`${routes.writing}${prev.slug}`}
            />
          )}
          {next && (
            <JumpLink
              next
              title={next.title}
              url={`${routes.writing}${next.slug}`}
            />
          )}
        </JumpLinkWrapper>

        <Comments
          shortname={process.env.DISQUS_SHORT_NAME}
          identifier={article.id}
          url={`${process.env.DISQUS_PAGE_URL}${location.pathname}`}
        />
      </PageContent>
    );
  }
}

/* eslint-disable no-undef */
export const pageQuery = graphql`
  query articleQuery($current: String!, $next: String, $prev: String) {
    current: contentfulBlogPost(id: { eq: $current }) {
      id
      title
      slug
      content {
        content
      }
      createdAt
    }

    next: contentfulBlogPost(id: { eq: $next }) {
      title
      slug
    }

    prev: contentfulBlogPost(id: { eq: $prev }) {
      title
      slug
    }
  }
`;
/* eslint-enable no-undef */