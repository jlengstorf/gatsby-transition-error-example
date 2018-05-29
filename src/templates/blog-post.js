import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import get from 'lodash/get'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import Bio from '../components/Bio'
import { rhythm, scale } from '../utils/typography'

import './animations.css';

class TransitionHandler extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.location.pathname === window.location.pathname;
  }

  render() {
    const {children} = this.props;
    return (
      <div className="transition-container">
        {children}
      </div>
    );
  }
}

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const links = this.props.data.allMarkdownRemark.edges
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const { previous, next } = this.props.pathContext

    return (
      <div>
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        {links.map(({ node }) => (
          <Link to={node.fields.slug} key={node.fields.slug} style={{ margin: '0 0.5rem' }}>
            {node.frontmatter.title}
          </Link>
        ))}
        <TransitionGroup>
          <CSSTransition
              key={this.props.location.pathname}
              classNames="example"
              timeout={{ enter: 500, exit: 300 }}
          >
            <TransitionHandler
                location={this.props.location}

            >
            <div
              style={{
                margin: '0 auto',
                maxWidth: 960,
                padding: '0px 1.0875rem 1.45rem',
                paddingTop: 0,
              }}
            >
                      <h1>{post.frontmatter.title}</h1>
            <p
              style={{
                ...scale(-1 / 5),
                display: 'block',
                marginBottom: rhythm(1),
                marginTop: rhythm(-1),
              }}
            >
              {post.frontmatter.date}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
            <hr
              style={{
                marginBottom: rhythm(1),
              }}
            />
            <Bio />

            <ul
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                listStyle: 'none',
                padding: 0,
              }}
            >
              {previous && (
                <li>
                  <Link to={previous.fields.slug} rel="prev">
                    ← {previous.frontmatter.title}
                  </Link>
                </li>
              )}

              {next && (
                <li>
                  <Link to={next.fields.slug} rel="next">
                    {next.frontmatter.title} →
                  </Link>
                </li>
              )}
            </ul>
            </div>
            </TransitionHandler>
          </CSSTransition>
        </TransitionGroup>
      </div>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
