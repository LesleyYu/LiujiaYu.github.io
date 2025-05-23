package com.example.artsyapp.data.repository

import android.util.Log
import com.example.artsyapp.data.model.AddFavBody
//import com.example.artsyapp.data.model.ArtistDetailDto
import com.example.artsyapp.data.model.ArtistDto
import com.example.artsyapp.data.model.CategoriesDto
import com.example.artsyapp.data.model.CategoryDto
import com.example.artsyapp.data.model.FavoriteDto
import com.example.artsyapp.data.remote.ApiService
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ArtistRepositoryImpl @Inject constructor(
    private val api: ApiService
) : ArtistRepository {

    override suspend fun search(query: String): Result<List<ArtistDto>> = runCatching {
        val resp = api.search(query)
        if (!resp.isSuccessful) throw Exception("Search failed: ${resp.code()}")
        resp.body()?.artists.orEmpty()
    }

    override suspend fun fullArtist(id: String): Result<FullArtistBundle> = runCatching {
        // 1) basic info
//        val aResp = api.artist(id)
//        if (!aResp.isSuccessful) throw Exception("Artist fetch failed: ${aResp.code()}")
//        val artist = aResp.body()!!
        val artist = api.artist(id).body()
            ?: throw Exception("Empty artist body")

        // 2) artworks
        val artworks = api.artworks(id).body()?.artworks.orEmpty()

        // 3) similar
        val similar = api.similar(id).body()?.similar.orEmpty()

        // 4) is it favorite?
        val favs = api.favorites().body()?.favorites.orEmpty()
        val starred = favs.any { it.artistId == id }

        FullArtistBundle(artist, artworks, similar, starred)
    }

    override suspend fun toggleFavorite(artist: ArtistDto) {
        val id = artist.id ?: return
        val favs = api.favorites().body()?.favorites.orEmpty()
        val isFav = favs.any { it.artistId == id }

        if (isFav) {
            api.removeFav(id)
        } else {
            api.addFav(
                id,
                AddFavBody(
                    title  = artist.title,
                    bioUrl = artist.bioUrl.orEmpty(),
                    imgUrl = artist.imgUrl.orEmpty()
                )
            )
        }
    }

    override suspend fun loadCategories(artworkId: String): Result<List<CategoryDto>> = runCatching {
        Log.d("Repo", "Loading categories for artworkId=$artworkId")
        val resp = api.genes(artworkId)
        if (!resp.isSuccessful) throw Exception("Gene fetch failed: ${resp.code()}")
        resp.body()?.genes.orEmpty()
    }
}