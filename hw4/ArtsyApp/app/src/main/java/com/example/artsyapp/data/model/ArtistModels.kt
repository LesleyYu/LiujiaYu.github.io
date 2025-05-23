@file:OptIn(kotlinx.serialization.ExperimentalSerializationApi::class)

package com.example.artsyapp.data.model

import kotlinx.serialization.Serializable
import kotlinx.serialization.SerialName
import kotlinx.serialization.json.JsonNames

//@Serializable
//data class ArtistDto(
////    val _id: String? = null,           // when coming from MongoDB
//    val id: String? = null,            // when coming straight from Artsy
//    val title: String,
//    val bioUrl: String? = null,
//    val imgUrl: String? = null,
//    val nationality: String? = null
//)

@Serializable
data class ArtistDto(
    val _id: String? = null,           // when coming from MongoDB
    val id: String? = null,            // when coming straight from Artsy

    @SerialName("name")
    @JsonNames("title")
    val title: String,

    val birthday: String? = null,
    val deathday: String? = null,
    val nationality: String? = null,
    val biography: String? = null,
    val bioUrl: String? = null,
    val imgUrl: String? = null,
    val genes: String? = null,
    val similar_artists: String? = null
)

@Serializable
data class SearchResultDto(
    val artists: List<ArtistDto>
)

@Serializable
data class ArtworksDto(
    val artworks: List<ArtworkDto>
)

@Serializable
data class ArtworkDto(
    val id: String,
    val title: String,
    val imgUrl: String? = null
)

@Serializable
data class SimilarDto(
    @SerialName("artists")
    val similar: List<ArtistDto>
)

@Serializable
data class CategoryDto(
    @SerialName("name")
    val name: String,

    val description: String?,
    val imgUrl: String?
)

@Serializable
data class CategoriesDto(
    @SerialName("genes")
    val genes: List<CategoryDto>
)