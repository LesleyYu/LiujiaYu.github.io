export interface Artist {
    imgUrl: string;
    title: string;
    bioUrl: string;
    id: string;
}

export interface ArtistInfoType {
    name: string;
    birthday: string;
    deathday: string;
    nationality: string;
    biography: string;
}

export interface Artwork {
    id: string;
    title: string;
    date: string;
    imgUrl: string;
}

export interface Category {
    name: string;
    imgUrl: string;
}

export const searchArtist = async (query: string): Promise<Artist[]> => {  // 这里的冒号表示 本匿名函数使用了 Promise接口，Promise接口内的类型变量是 Artist[]
    const response = await fetch(`/search/${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.artists;
}

export const getArtistInfo = async (id: string): Promise<ArtistInfoType> => {
    const response = await fetch(`/artist/${encodeURIComponent(id)}`);
    const data = await response.json();
    return data;
}

export const getArtWorks = async (artistId: string): Promise<Artwork[]> => {
    const response = await fetch(`/artworks/${encodeURIComponent(artistId)}`);
    const data = await response.json();
    return data.artworks;
}

export const getCategories = async (artworkId: string): Promise<Category[]> => {
    const response = await fetch(`/genes/${encodeURIComponent(artworkId)}`);
    const data = await response.json();
    return data.genes;
}