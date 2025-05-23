package com.example.artsyapp.data.repository

import com.example.artsyapp.data.model.LoginBody
import com.example.artsyapp.data.model.RegisterBody
import com.example.artsyapp.data.model.UserDto
import kotlinx.coroutines.flow.StateFlow
import kotlinx.serialization.Serializable

/**
 * Manages user session: login, register, logout, and current user state.
 */
interface AuthRepository {

    /** Current logged‑in user, or null if logged out */
    val user: StateFlow<UserDto?>

    /** Attempts login; on success emits [UserDto] into [user] */
    suspend fun login(email: String, password: String): Result<UserDto>

    /** Attempts registration; on success emits [UserDto] into [user] */
    suspend fun register(fullName: String, email: String, password: String): Result<UserDto>

    /** Logs out, clears cookies and emits null into [user] */
    suspend fun logout(): Result<Unit>
}