package com.example.artsyapp.data.model

import kotlinx.serialization.Serializable

@Serializable
data class FavoriteDto(
    val artistId: String,
    val title: String,
    val bioUrl: String? = null,
    val imgUrl: String? = null,
    val addedAt: String                // ISO date string from MongoDB
)

/** body that <POST /favorites/{artistId}> expects */
@Serializable
data class AddFavBody(
    val title: String,
    val bioUrl: String,
    val imgUrl: String
)

@Serializable
data class FavoritesResultDTO(val favorites: List<FavoriteDto>)