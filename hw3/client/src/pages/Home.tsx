import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom'; // todo: ArtistDetail Page
import { Artist, getCurrentUser, searchArtist } from '../utils/api';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import ArtistDetails from '../components/ArtistDetails';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { setUser } = useAuth();  // set User when in Home. Prevent no profile in navbar after registration
  const location = useLocation(); // for: ArtistDetail Page
  const navigate = useNavigate();
  const searchState = location.state as { 
    artists?: Artist[], 
    searchInitiated?: boolean,
    preserveSearch?: boolean
  } | undefined;
  const { artistId } = useParams<{ artistId: string }>();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (artistId && searchState?.preserveSearch !== true) {
      setArtists([]);
    }
  }, [artistId, searchState]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSearchInitiated(true);
    if (artistId) {
      navigate('/');
    }
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

      {(
        // Render SearchResults only when:
        // - No artistId: display search results from local state if any.
        // - ArtistDetails view with preserved search state: display search results passed via location.state.
        (!artistId && artists.length > 0 && !loading) ||
        (artistId && searchState?.preserveSearch === true && searchState?.artists && searchState?.artists.length > 0)
      ) && (
        <SearchResults 
          artists={ artistId ? searchState?.artists ?? [] : artists}
          searchInitiated={ artistId ? searchState?.searchInitiated ?? false : searchInitiated }
          currentArtistId={artistId ? artistId : undefined}
        />
      )}

      {artistId && (
        <ArtistDetails artistId={artistId} />
      )}
    </div>
  );
};

export default Home;