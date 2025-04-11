import { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom'; // todo: ArtistDetail Page
import { Artist, searchArtist } from '../utils/api';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import ArtistDetails from '../components/ArtistDetails';

const Home = () => {
   // for: ArtistDetail Page
  const location = useLocation();
  const searchState = location.state as { artists?: Artist[], searchInitiated?: boolean } | undefined;
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);
  // const [artistId, setArtistId] = useState<string | null>(null);

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
          navigate('/');
        }}
      />

      {/* when on root path (!artistiId), show search results if any */}
      {
        !artistId && artists.length > 0 && !loading &&
          <SearchResults artists={artists} searchInitiated={searchInitiated}
          />
      }

      {artistId && (
        <>
          { searchState && (
            <SearchResults 
              artists={searchState.artists || []}
              searchInitiated={searchState.searchInitiated || false}
              currentArtistId={artistId}
            />
          )}
          <ArtistDetails artistId={artistId}/>
        </>
      )}
    </div>
  );
};

export default Home;