import { useState } from 'react';
import { Artist, searchArtist } from '../utils/api';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import ArtistDetails from '../components/ArtistDetails';
import { useLocation } from 'react-router-dom'; // todo: ArtistDetail Page


const Home = () => {
   // todo: ArtistDetail Page
  const location = useLocation();
  // Optionally retrieve state passed along when returning from navigating
  const searchState = location.state as { artists?: any[], searchInitiated?: boolean } | undefined;

  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [artistId, setArtistId] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSearchInitiated(true);
    try {
      const results = await searchArtist(query);
      setArtists(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow-1 mt-3">
      <SearchBar 
        loading={loading}
        onSearch={handleSearch} 
        onClear={() => { 
          setArtists([]); 
          setSearchInitiated(false); 
          setArtistId(null); }
        }
      />

      {
        loading ? null : (
          // // Only render search results if there is no navigation state or if you want always
           // todo: ArtistDetail Page
          !searchState && (
          <SearchResults 
            artists={artists} 
            searchInitiated={searchInitiated}
            setArtistId={setArtistId}
          />
        )
      )}

      {/* {artistId && ( */}
      {artistId && !searchState && (
        <ArtistDetails artistId={artistId} />
      )}
    </div>
  );
};

export default Home;