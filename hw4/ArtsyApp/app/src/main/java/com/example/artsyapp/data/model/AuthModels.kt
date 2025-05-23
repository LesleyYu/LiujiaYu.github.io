package com.example.artsyapp.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class LoginBody(
    val email: String,
    val password: String
)

@Serializable
data class RegisterBody(
    @SerialName("fullname") val fullName: String,
    val email: String,
    val password: String
)

@Serializable
data class AuthResponse(
    val message: String,
    val user: UserDto
)

@Serializable
data class UserDto(
    @SerialName("_id")  val id: String,
    val fullname: String,
    val email: String,
    val profileImageUrl: String? = null,
    val favorites: List<FavoriteDto> = emptyList()
)