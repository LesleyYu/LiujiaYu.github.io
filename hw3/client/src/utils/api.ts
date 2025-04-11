export interface Artist {
  imgUrl: string;
  title: string;
  bioUrl: string;
  id: string;
}

export interface SimilarArtist {
  imgUrl: string;
  name: string;
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

export const searchArtist = async (query: string): Promise<Artist[]> => {
  // 这里的冒号表示 本匿名函数使用了 Promise接口，Promise接口内的类型变量是 Artist[]
  const response = await fetch(`/api/search/${encodeURIComponent(query)}`);
  const data = await response.json();
  return data.artists;
};

export const getArtistInfo = async (id: string): Promise<ArtistInfoType> => {
  const response = await fetch(`/api/artist/${encodeURIComponent(id)}`);
  const data = await response.json();
  console.log("Artist Info:", data);
  return data;
};

export const getSimilarArtists = async (artistId: string): Promise<SimilarArtist[]> => {
  const response = await fetch(`/api/similar/${encodeURIComponent(artistId)}`);
  const data = await response.json();
  return data.artists;
};

export const getArtWorks = async (artistId: string): Promise<Artwork[]> => {
  const response = await fetch(`/api/artworks/${encodeURIComponent(artistId)}`);
  const data = await response.json();
  return data.artworks;
};

export const getCategories = async (artworkId: string): Promise<Category[]> => {
  const response = await fetch(`/api/genes/${encodeURIComponent(artworkId)}`);
  const data = await response.json();
  return data.genes;
};

// ==== Authenticated APIs ====

export interface UserProfile {
  _id: string;
  fullname: string;
  email: string;
  profileImageUrl: string;
  favorites: Favorite[];
}

export const registerUser = async (
  fullname: string,
  email: string,
  password: string
) => {
  const res = await fetch("/api/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullname, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;

  // console.log('Status:', res.status); // Check status
  // const text = await res.text();
  // console.log('Response Text:', text);

  // let data;
  // try {
  //     data = JSON.parse(text);
  // } catch (err) {
  //     console.error('Failed parsing JSON:', err, text);
  //     throw new Error('Invalid server response');
  // }

  // if (!res.ok) {
  // throw new Error(data.error || 'Request failed');
  // }

  // return data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch("/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // for cookies
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data.user;
};

export const logoutUser = async () => {
  await fetch("/api/user/logout", { method: "POST", credentials: "include" });
};

export const deleteUserAccount = async () => {
  await fetch("/api/user/delete-account", {
    method: "DELETE",
    credentials: "include",
  });
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  const res = await fetch("/api/user/me", { credentials: "include" });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("getCurrentUser failed:", res.status, errorText);
    return null;
  }
  return res.json();
};

// ==== Favorites APIs ====

export interface Favorite {
  artistId: string;
  title: string;
  bioUrl: string;
  imgUrl: string;
  addedAt: string;
}

// et the user's favorites list
export const getFavorites = async (): Promise<Favorite[]> => {
  const response = await fetch("/api/user/favorites", { credentials: "include" });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch favorites: ${errorText}`);
  }
  const data = await response.json();
  return data.favorites;
};
  

// remove an artist from favorites
export const removeFavorite = async (artistId: string): Promise<Favorite[]> => {
  const response = await fetch(`/api/user/favorites/${artistId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to remove favorite for artist ${artistId}: ${errorText}`
    );
  }
  const data = await response.json();
  return data.favorites;
};

// add an artist to favorites
export const addFavorite = async (artistId: string): Promise<Favorite[]> => {
  // get artist details for adding to database
  const detailResponse = await fetch(`/api/artist/${encodeURIComponent(artistId)}`);
  const detail = await detailResponse.json();
  const title = detail.name;
  const { bioUrl, imgUrl} = detail;

  // adding fav artist details to databse
  const response = await fetch(`/api/user/favorites/${artistId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, bioUrl, imgUrl }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to add favorite for artist ${artistId}: ${errorText}`
    );
  }
  const data = await response.json();
  return data.favorites;
};

