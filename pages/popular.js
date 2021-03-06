import { Layout } from "../components/function";
import { Container, Content, Header, Right, Sidebar } from "../components";
import { useEffect, useState } from "react";
import { sanity } from "../lib/sanity";
import { getPalettePopular } from "../lib/query";
import { useStateContext } from "../context/StateContext";
import InfiniteScroll  from "react-infinite-scroller";

export default function Home({ palettes }) {
  const { updatePalettes, updateLoadingPalettes, setterLike, setterTitleRight, setterDescriptionRight, checkQueryEmpty, setPalettes } = useStateContext();
  const [count, setCount] = useState(20);
  const [more, setMore] = useState(false);
  const [dataPalettes, setDataPalettes] = useState([]);
  const fetchData = () => {
    setMore(false);
    sanity.fetch(getPalettePopular(count,count+20))
    .then(data=>{
        if (data.length>0) {
            setPalettes(old=>[...old,...data]);
            setterLike([...dataPalettes,...data]);
            setDataPalettes(old=>[...old,...data]);
            setCount(count+20);
            setMore(true);
        }else{
            setMore(false);
        }
    });
  }
  useEffect(()=>{
    updatePalettes(palettes);
    setterLike(palettes);
    setDataPalettes(palettes);
    updateLoadingPalettes(false);
    setterTitleRight('Color Palettes for Designers and Artists');
    setterDescriptionRight('Discover the newest hand-picked palettes of Color Shop');
    checkQueryEmpty();
    setMore(true);
  },[])
  return (
    <Layout title="The Most Popular Color Palettes of 2022 - Color Shop">
      <Container>
        <Header/>
        <Sidebar/>
        <InfiniteScroll
            pageStart={0}
            loadMore={fetchData}
            hasMore={more}
        >
          <Content/>
        </InfiniteScroll>
        <Right/>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps() {
  const palettes = await sanity.fetch(getPalettePopular(0,20));
  return { props: { palettes } }
}
