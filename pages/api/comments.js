import { gql, GraphQLClient } from "graphql-request";

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT
const graphToken = process.env.GRAPHCMS_TOKEN


export default async function comments(req, res){
  // endibu yerda GraphQLClient(url) orqali request yuboramiza.
  const graphQLClient = new GraphQLClient(graphqlAPI, {
    headers: {
      authorization: `Bearer ${graphToken}`
    }
  })

  //mutation orqqali server malumotlarini uzgartirishimiz mumkin.
  //va uni ishlatganimizdan keyin obj ni bizaga qaytarib berar ekan.
  const query = gql`
    mutation CreateComment($name: String!, $email: String!, $comment: String!, $slug: String!) {
      createComment(data: {name: $name, email: $email, comment: $comment, post: {connect: {slug: $slug}}}){id}
    }
  `
  try{
    // bu yerdagi request body commentsFrom dagi formlarni name mi. 
    const result = await graphQLClient.request(query, req.body)
    return res.status(200).send(result)
  }catch(e){
    console.log(e);
  }
}
