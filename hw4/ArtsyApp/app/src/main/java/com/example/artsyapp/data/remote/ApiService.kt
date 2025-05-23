package com.example.artsyapp.data.remote

import com.example.artsyapp.data.model.AddFavBody
//import com.example.artsyapp.data.model.ArtistDetailDto
import com.example.artsyapp.data.model.ArtistDto
import com.example.artsyapp.data.model.ArtworksDto
import com.example.artsyapp.data.model.AuthResponse
import com.example.artsyapp.data.model.CategoriesDto
import com.example.artsyapp.data.model.FavoriteDto
import com.example.artsyapp.data.model.FavoritesResultDTO
import com.example.artsyapp.data.model.LoginBody
import com.example.artsyapp.data.model.RegisterBody
import com.example.artsyapp.data.model.SearchResultDto
import com.example.artsyapp.data.model.SimilarDto
import com.example.artsyapp.data.model.UserDto
import kotlinx.serialization.Serializable
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {

    // --- Auth ---
    @POST("/api/user/login")
    suspend fun login(@Body body: LoginBody): Response<AuthResponse>

    @POST("/api/user/register")
    suspend fun register(@Body body: RegisterBody): Response<AuthResponse>

    @POST("/api/user/logout")
    suspend fun logout(): Response<Unit>

    @GET("/api/user/me")
    suspend fun me(): Response<UserDto>

    // --- Search & artist ---
//    @GET("/api/search/{q}")
//    suspend fun search(@Path("q") query: String): Response<SearchResultDto>
    @GET("/api/search/{query}")
    suspend fun search(@Path("query") query: String): Response<SearchResultDto>

    @GET("/api/artist/{id}")
    suspend fun artist(@Path("id") artistId: String): Response<ArtistDto>   // ArtistDetailDto

    @GET("/api/artworks/{id}")
    suspend fun artworks(@Path("id") artistId: String): Response<ArtworksDto>

    @GET("/api/similar/{id}")
    suspend fun similar(@Path("id") artistId: String): Response<SimilarDto>

    @GET("/api/genes/{id}") // todo
    suspend fun genes(@Path("id") artworkId: String): Response<CategoriesDto>

    // --- Favorites ---
    @GET("/api/user/favorites")
    suspend fun favorites(): Response<FavoritesResultDTO>

    @POST("/api/user/favorites/{artistId}")
    suspend fun addFav(
        @Path("artistId") artistId: String,
        @Body body: AddFavBody
    ): Response<FavoriteDto>

    @DELETE("/api/user/favorites/{artistId}")
    suspend fun removeFav(@Path("artistId") artistId: String): Response<FavoriteDto>
}