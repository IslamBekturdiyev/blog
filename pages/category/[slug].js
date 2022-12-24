import React from 'react'
import { useRouter } from 'next/router'; //useRouterni Loader ishlatish mqasadida ishlatamiz.
import { getCategories, getCategoryPost } from '../../services/indexe';
import {PostCard, Categories, Loader} from '../../components';
//nextda sluglar bn ishlash juda oson category papka ochib uni ichiga [slug].js ochamiza va qarabsizki category ga bosganda category slugini ko'rsatadiyu osha ni ichida nima chiqishini ko'rsatamiz.

export default function Category({posts}) {
  const router = useRouter()
  if (router.isFallback) {
    return <Loader />
  }

  // console.log(posts);
  return (
    <div className='container mx-auto px-10 mb-8'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
        
        <div className='col-span-1 lg:col-span-4'>
          <div className='relative lg:sticky top-8'>
          <Categories/>
          </div>
        </div>

        <div className='col-span-1 lg:col-span-8'>
          {posts.map((post, index) => (
            <PostCard key={index} post={post.node}/>
          ))}
        </div>

      </div>
    </div>
  )
}

export async function getStaticProps({params}) {
  const posts = await getCategoryPost(params.slug)

  return {
    props: {posts}
  }
}

export async function getStaticPaths() {
  const categories = await getCategories()
  return{
    paths: categories.map(({slug}) => ({params: {slug}})),
    fallback: true
  }
}
