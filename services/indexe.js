import { request, gql } from "graphql-request";

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT

//endi bu fun async bolishi kerak, cauase biz server bn ishlavommiza.
const getPosts = async () => {
    const query = gql`
        query Assets {
            postsConnection {
                edges {
                node {
                    author {
                    bio
                    name
                    photo {
                        url
                    }
                    }
                    createdAt
                    slug
                    title
                    excerpt
                    featuredImage {
                    url
                    }
                }
                }
            }
            categories {
                name
                slug
            }
        }
    `

    const result = await request(graphqlAPI, query)
    return result.postsConnection.edges
}
export default getPosts


export const getCategoryPost = async (slug) => {
    const query = gql`
        query GetCategoryPost($slug: String!) {
            postsConnection(where: {categories_some: {slug: $slug}}){
                edges {
                    node {
                        author {
                        bio
                        name
                        photo {
                            url
                        }
                        }
                        createdAt
                        slug
                        title
                        excerpt
                        featuredImage {
                        url
                        }
                        categories {
                            name
                            slug
                        }
                    }
                }
            }
        }
    `

    const result = await request(graphqlAPI, query, {slug})
    return result.postsConnection.edges
}

export const getRecentPosts = async () => {
    const query = gql`
        query GetPostDetails() {
            posts(
                orderBy: createdAt_ASC
                last: 3
            ) {
                title
                featuredImage{
                    url
                }
                createdAt
                slug
            }
        }
    `
    const result = await request(graphqlAPI, query)
    return result.posts
}

export const getSimilarPosts = async (categories, slug) => {
    const query = gql`
    # dollar znaqi orqali props ni param beramiza.
        query GetPostDetails($slug: String!, $categories: [String!]){
            posts(
                where: {slug_not: $slug, AND: {categories_some: {slug_in: $categories}}}
                last: 3
            ) {
                title
                featuredImage{
                    url
                }
                createdAt
                slug
            }
        }
    `

    const result = await request(graphqlAPI, query, { categories, slug })
    return result.posts
}

export const getCategories = async () => {
    const query = gql`
        query getCategories {
            categories{
                name
                slug
            }
        }
    `
    const result = await request(graphqlAPI, query)
    return result.categories
}

export const getPostDtails = async (slug) => {
    const query = gql`
        query getPostDetails($slug: String!){
            post(where: {slug: $slug}){
                author{
                    bio
                    name
                    id 
                    photo{
                        url
                    }
                }
                createdAt
                slug
                title
                excerpt
                featuredImage{
                    url
                }
                categories{
                    name
                    slug
                }
                content {
                    raw 
                }
            }
        }
    `
    // bu yerda slug ni berib qoyishimiza kere, chunki bu functionda bu param ni ichiga tushishi kere.
    const result = await request(graphqlAPI, query, { slug })
    return result.post
}

//commentni yuborish api fayldagi (hello)comments.js ga sorov yuboramiza.
export const submitComment = async (obj) => {
    const result = await fetch('/api/comments', {
        method: "Post",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(obj),
    });
    return result.json()
}

export const getComments = async (slug) => {
    const query = gql`
        query GetComments($slug: String!){
            comments(where: {post: {slug: $slug}}){
                name
                createdAt
                comment
            }
        }
    `
    const result = await request(graphqlAPI, query, { slug })
    return result.comments
}

// carousel uchun post.
export const getFeaturedPosts = async() => {
    const query = gql`
        query GetCategoryPost() {
            posts(where: {featuredPost: true}){
                author{
                    name
                    photo{
                        url
                    }
                }
                featuredImage{
                    url
                }
                title
                slug
                createdAt
            }
        }
    `
    const result = await request(graphqlAPI, query)
    return result.posts
}