package com.example.artsyapp.data.repository

//import com.example.artsyapp.data.model.ArtistDetailDto
import com.example.artsyapp.data.model.ArtistDto
import com.example.artsyapp.data.model.ArtworkDto
import com.example.artsyapp.data.model.CategoriesDto
import com.example.artsyapp.data.model.CategoryDto
import com.example.artsyapp.data.model.FavoriteDto
import kotlinx.serialization.Serializable

/**
 * Bundles all details needed for detail screen.
 */
@Serializable
data class FullArtistBundle(
    val artist: ArtistDto, // ArtistDetailDto
    val artworks: List<ArtworkDto>,
    val similar: List<ArtistDto>,
    val starred: Boolean
)

/**
 * Surface for all artist‑related data operations.
 */
interface ArtistRepository {

    /** Search by name */
    suspend fun search(query: String): Result<List<ArtistDto>>

    /** Fetch single artist + artworks + similar + starred flag */
    suspend fun fullArtist(id: String): Result<FullArtistBundle>

    /** Add or remove favorite based on current state */
    suspend fun toggleFavorite(artist: ArtistDto)

    /** Fetch artwork categories */
    suspend fun loadCategories(artworkId: String): Result<List<CategoryDto>>
}